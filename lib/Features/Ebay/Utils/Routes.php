<?php

/**
 * Created by PhpStorm.
 * User: fregini
 * Date: 3/21/16
 * Time: 12:05 PM
 */

namespace Features\Ebay\Utils;

class Routes {


    public static function staticSrc( $file, $options = [] ) {
        $host = \Routes::pluginsBase( $options );

        return $host . "/ebay/static/src/$file";
    }

    public static function staticBuild( $file, $options = [] ) {
        $host = \Routes::pluginsBase( $options );

        return $host . "/ebay/static/build/$file";
    }

    /**
     * @param       $params array URL parameters to pass to the controller
     * @param array $options
     *
     * @return string
     * @throws \Exception
     */
    public static function analyze( $params, $options = [] ) {
        $params = \Utils::ensure_keys( $params, [
                'project_name', 'id_project', 'password'
        ] );

        $base = \Routes::pluginsBase( $options );

        return $base . "/ebay/analyze/" .
                $params[ 'project_name' ] . "/" .
                $params[ 'id_project' ] . "-" .
                $params[ 'password' ];
    }
}