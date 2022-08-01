<?php

/**
 * Created by PhpStorm.
 * User: fregini
 * Date: 3/21/16
 * Time: 1:58 PM
 */
class AnalyzePageTest extends IntegrationTest {

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

    function tests_analyze_page_is_custom() {
        $result = integrationCreateTestProject( [
                'headers' => $this->test_data->headers,
                'files'   => [
                        test_file_path( 'xliff/sdlxliff-with-mrk-and-note.xlf.sdlxliff' )
                ],
                'params'  => [
                        'metadata'    => '{"project_type" : "MT"}',
                        'source_lang' => 'en-US',
                        'target_lang' => 'it-IT',
                        'name'        => 'foo',
                ]
        ] );

        $this->assertEquals( \Features\Ebay\Utils\Routes::analyze(
                [
                        'id_project'   => $result->id_project,
                        'password'     => $result->project_pass,
                        'project_name' => 'foo'
                ], [ 'http_host' => 'http://localhost' ]
        ), $result->analyze_url );
    }
}