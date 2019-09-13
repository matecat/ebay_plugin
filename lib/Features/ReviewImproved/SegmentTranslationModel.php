<?php
/**
 * Created by PhpStorm.
 * User: fregini
 * Date: 1/24/16
 * Time: 10:21 AM
 */

namespace Features\ReviewImproved;

use Features\ReviewExtended;
use LQA\ChunkReviewDao;

class SegmentTranslationModel extends ReviewExtended\SegmentTranslationModel {

    /**
     * @throws \Exception
     */
    public function recountPenaltyPoints() {
        $penaltyPoints                      = ChunkReviewDao::getPenaltyPointsForChunk( $this->_chunk );
        $this->_chunkReviews[0]->penalty_points = $penaltyPoints;

        $chunk_review_model = new ChunkReviewModel( $this->_chunkReviews[0] );
        $chunk_review_model->updatePassFailResult( $this->_project );
    }

}