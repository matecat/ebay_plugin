<?php
/**
 * Created by PhpStorm.
 * @author ostico domenico@translated.net / ostico@gmail.com
 * Date: 22/08/19
 * Time: 15.04
 *
 */

namespace Features\ReviewImproved\Controller\API\V2\Validators;


use API\V2\Exceptions\ValidationError;
use Exception;
use Features\TranslationVersions\Model\TranslationEventDao;

class SegmentTranslationIssueValidator extends \API\V2\Validators\SegmentTranslationIssueValidator {

    /**
     *
     * @throws Exception
     * @throws ValidationError
     */
    protected function __ensureSegmentRevisionIsCompatibleWithIssueRevisionNumber() {

        $latestSegmentEvent = ( new TranslationEventDao() )->getLatestEventForSegment( $this->chunk_review->id_job, $this->translation->id_segment );

        if ( !$latestSegmentEvent && !$this->translation->isICE() && !$this->translation->isPreTranslated() ) {
            throw new ValidationError( 'Unable to find the current state of this segment. Please report this issue to support.' );
        }

    }

}