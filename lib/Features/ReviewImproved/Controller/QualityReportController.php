<?php
/**
 * Created by PhpStorm.
 * User: fregini
 * Date: 2/11/16
 * Time: 5:32 PM
 */

namespace Features\ReviewImproved\Controller;

use Chunks_ChunkDao;
use Chunks_ChunkStruct;
use Exceptions\NotFoundException;
use Features;
use Features\ReviewExtended\Model\QualityReportModel;
use Features\ReviewImproved\Decorator\QualityReportDecorator;
use Jobs_JobStruct;

class QualityReportController extends \BaseKleinViewController {

    /**
     * @var Jobs_JobStruct
     */
    private $job;

    /**
     * @var Chunks_ChunkStruct
     */
    private $chunk;
    /**
     * @var QualityReportModel
     */
    private $model;

    public function respond( $method ) {

        $this->performValidations();

        $this->setDefaultTemplateData();

        $model     = $this->getModel();
        $decorator = new QualityReportDecorator( $model );

        $decorator->setDownloadURI( $this->downloadURI() );
        $decorator->decorate( $this->view );

        $this->response->body( $this->view->execute() );

        if ( $this->isDownload() ) {
            $this->response->header(
                    'Content-Disposition',
                    "attachment; filename={$decorator->getFilenameForDownload()}"
            );
        }
        $this->response->send();
    }

    private function downloadURI() {
        list( $uri, ) = explode( '?', $this->request->uri() );

        return $uri . '?download=1';
    }

    /**
     * @throws NotFoundException
     */
    private function getModel() {
        $this->model = new QualityReportModel( $this->findChunk() );

        if ( $this->request->version ) {
            $this->model->setVersionNumber( $this->request->version );
        }

        return $this->model;
    }

    private function isDownload() {
        $param = $this->request->paramsGet( 'download' );

        return isset( $param[ 'download' ] );
    }

    /**
     * @return Chunks_ChunkStruct
     * @throws NotFoundException
     */
    private function findChunk() {
        $this->chunk = Chunks_ChunkDao::getByIdAndPassword(
                $this->request->param( 'id_job' ),
                $this->request->param( 'password' )
        );

        $this->featureSet->loadForProject( $this->chunk->getProject() );

        if ( !$this->chunk ) {
            throw new NotFoundException();
        }

        // TODO: check this condition is necessary, this controller should only be used by an instance of AbstractRevisionFeature
        if ( !$this->featureSet->hasRevisionFeature() ) {
            throw new NotFoundException();
        }

        return $this->chunk;
    }
}