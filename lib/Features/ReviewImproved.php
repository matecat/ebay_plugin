<?php

namespace Features ;

use Chunks_ChunkStruct;
use Features\ReviewImproved\Controller\QualityReportController;
use LQA\ChunkReviewDao;
use Projects_ProjectDao;
use RevisionFactory;

class ReviewImproved extends AbstractRevisionFeature {
    const FEATURE_CODE = 'review_improved' ;

    protected static $conflictingDependencies = [] ;

    /**
     * postJobSplitted
     *
     * Deletes the previously created record and creates the new records matching the new chunks.
     *
     * @param \ArrayObject $projectStructure
     *
     * @throws \Exception
     */
    public function postJobSplitted( \ArrayObject $projectStructure ) {

        $id_job         = $projectStructure[ 'job_to_split' ];
        $old_reviews    = ChunkReviewDao::findByIdJob( $id_job );
        $first_password = $old_reviews[ 0 ]->review_password;

        $project = Projects_ProjectDao::findById( $projectStructure[ 'id_project' ], 86400 );

        $revisionFactory = RevisionFactory::initFromProject( $project );

        ChunkReviewDao::deleteByJobId( $id_job );

        $chunksStructArray = \Jobs_JobDao::getById( $id_job, 0, new Chunks_ChunkStruct() );

        $reviews = $this->createQaChunkReviewRecords( $chunksStructArray, $project, [
                'first_record_password' => $first_password
        ] );


        foreach ( $reviews as $review ) {
            $model = $revisionFactory->getChunkReviewModel( $review );
            $model->recountAndUpdatePassFailResult( $project );
        }

    }

    /**
     * Install routes for this plugin
     *
     * @param \Klein\Klein $klein
     */
    public static function loadRoutes( \Klein\Klein $klein ) {
        $klein->respond('GET', '/quality_report/[:id_job]/[:password]',                    array(__CLASS__, 'callbackQualityReport')  );
        $klein->respond('GET', '/quality_report/[:id_job]/[:password]/versions/[:version]', array(__CLASS__, 'callbackQualityReport')  );
    }

    public static function callbackQualityReport($request, $response, $service, $app) {
        $controller = new QualityReportController( $request, $response, $service, $app);
        $template_path = dirname(__FILE__) . '/ReviewImproved/View/Html/quality_report.html' ;
        $controller->setView( $template_path );
        $controller->respond('');
    }

    /**
     * This method handles the incompatibility between ReviewImproved and ReviewExtended
     * @param $features
     *
     * @return mixed
     */
    public function filterFeaturesMerged( $features ) {
        unset( $features[ ReviewExtended::FEATURE_CODE ] );
        unset( $features[ SecondPassReview::FEATURE_CODE ] );
        return $features;
    }

}
