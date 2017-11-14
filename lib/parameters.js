'use strict';

let _ =		require( 'lodash' );



class Parameters {


	static validateParams( params, config ){

		let errors =	[];
		let value;

		params =		params || {};


		_.forEach( config, ( reqs, key ) => {

			value =		params[ key ];


			// check data types
			if( ! Parameters.typeCheck( value, reqs ) ){

				errors.push( `parameter ${key} (${value}) is "${typeof value}" but requires "${reqs.type}"` );

			}


			// check required fields
			if( ! Parameters.requirementCheck( value, reqs ) ){

				errors.push( `parameter ${key} is required but got "${value}"` );

			}
			// default value
			else if( reqs.def && _.isNil( value ) ) {

				params[ key ] =	reqs.def;

			}

		} );


		if( errors.length ){

			params.errors =	errors;

		}


		return params;

	}


	static validateArgs( args, config ) {

		let params =	{};
		let errors = 	[];
		let value;


		_.forEach( config, ( reqs, index ) => {

			value =		args[ index ];


			// ensure that a name parameter is provided in config
			if( ! reqs.name ){

				throw new Error( `Name is required for validation arguments on index ${index}` );

			}


			// check data types
			if( ! Parameters.typeCheck( value, reqs ) ){

				errors.push( `argument ${reqs.name} (${value}) is "${typeof value}" but requires "${reqs.type}"` );

			}


			// check required fields
			if( ! Parameters.requirementCheck( value, reqs ) ){

				errors.push( `argument ${reqs.name} is required but got "${value}"` );

			}
			// default value
			else if( reqs.def && _.isNil( value ) ) {

				value =	reqs.def;

			}


			// set value in params
			params[ reqs.name ] =	value;

		} );


		if( errors.length ){

			params.errors =	errors;

		}


		return params;

	}


	static requirementCheck( value, config ){

		var isRequired =	_.get( config, 'required', false );

		if( isRequired === true && ( _.isNil( value ) || value === '' ) ){
			return false;
		} else {
			return true;
		}

	}


	static typeCheck( value, config ){

		var dataType =		_.get( config, 'type', 'any' ).toLowerCase();

		if( dataType === 'any' || typeof value === dataType || _.isNil( value ) ){
			return true;
		} else {
			return false;
		}

	}


	static getParamterError( errors, funcName ){

		return new Error( `Parameter validation failed for ${funcName}()\n\t${errors.join( '\n\t' )}` );

	}

}


module.exports = Parameters;