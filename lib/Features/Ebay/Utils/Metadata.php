<?php
/**
 * Created by PhpStorm.
 * User: fregini
 * Date: 23/12/2016
 * Time: 12:18
 */

namespace Features\Ebay\Utils;


class Metadata {

    public static $keys = [
            'due_date', 'project_type', 'word_count', 'vendor_id'
    ];

    /**
     * This function is to be used to filter both postInput from UI and
     * JSON string received from APIs.
     *
     * @return array
     */
    public static function getInputFilter() {
        return [
                'due_date'     => [
                        'filter' => FILTER_SANITIZE_STRING,
                        'flags'  => FILTER_FLAG_STRIP_LOW | FILTER_FLAG_STRIP_HIGH
                ],
                'project_type' => [
                        'filter' => FILTER_SANITIZE_STRING,
                        'flags'  => FILTER_FLAG_STRIP_LOW | FILTER_FLAG_STRIP_HIGH
                ],
                'word_count'   => [
                        'filter' => FILTER_SANITIZE_STRING,
                        'flags'  => FILTER_FLAG_STRIP_LOW | FILTER_FLAG_STRIP_HIGH
                ],
                'vendor_id'    => [
                        'filter' => FILTER_SANITIZE_STRING,
                        'flags'  => FILTER_FLAG_STRIP_LOW
                ]
        ];

    }

}