<?php

class MtProjectsStartInDraftTest extends IntegrationTest {

    function setUp() {
        $this->test_data       = new StdClass();
        $this->test_data->user = Factory_User::create();

        $feature = Factory_OwnerFeature::create( [
                'uid'          => $this->test_data->user->uid,
                'feature_code' => 'ebay'
        ] );

        $this->test_data->api_key = Factory_ApiKey::create( [
                'uid' => $this->test_data->user->uid,
        ] );

        $this->test_data->headers = [
                "X-MATECAT-KEY: {$this->test_data->api_key->api_key}",
                "X-MATECAT-SECRET: {$this->test_data->api_key->api_secret}"
        ];
    }


    function tests_mt_project_with_targets_sets_targets_in_draft() {
        $result = integrationCreateTestProject( [
                'headers' => $this->test_data->headers,
                'files'   => [
                        test_file_path( 'xliff/sdlxliff-with-mrk-and-note.xlf.sdlxliff' )
                ],
                'params'  => [
                        'metadata'    => '{"project_type" : "MT"}',
                        'source_lang' => 'en-US',
                        'target_lang' => 'it-IT'
                ]
        ] );

        // check
        $project = Projects_ProjectDao::findById( $result->id_project );

        $dao    = new Projects_MetadataDao( Database::obtain() );
        $record = $dao->get( $project->id, 'project_type' );

        $this->assertEquals( 'MT', $record->value );

        $chunksDao    = new Chunks_ChunkDao( Database::obtain() );
        $chunks       = $chunksDao->getByProjectID( $project->id );
        $chunk        = $chunks[ 0 ];
        $translations = $chunk->getTranslations();

        $this->assertEquals( Constants_TranslationStatus::STATUS_DRAFT, $translations[ 0 ]->status );


    }

}