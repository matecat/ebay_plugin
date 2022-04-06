<?php
/**
 * Created by PhpStorm.
 * User: fregini
 * Date: 18/05/2017
 * Time: 15:46
 */

namespace Features\ReviewImproved\Model;

use Chunks_ChunkStruct;
use Database;
use Features;
use Log;

class ProjectCompletionEventSaved {

    public static function triggerForTranslate( Chunks_ChunkStruct $chunk, $completion_event_id ) {

        try {
            Database::obtain()->begin();
            Database::obtain()->commit();
        } catch ( \Exception $e ) {
            Log::doJsonLog( 'Error during ReviewImproved\Model\ProjectCompletionEventSaved::triggerForTranslate: ' . $e->getMessage() );

            Database::obtain()->rollback();
        }

    }

}