
describe( 'Parameters', () => {

	let parameters =	require( '../lib/parameters' );
	var config =		{
		customer : {
			required : 	true,
			type :		'number'
		},
		type : {
			required :	false,
			type :		'string',
			def :		'my default'
		},
		isFlag : {
			required :	true
		},
		options : {

		}
	};

	let paramsTester =	( params ) => {

		return parameters.validateParams( params, config );

	};

	let argsTester = 	( customer, type, isFlag, options ) => {

		return parameters.validateArgs( arguments, config );


	};


	describe( 'validateParams', () => {

		it( 'should pass validation when params are valid', () => {

			//throw( parameters.getParamterError( ['error 1', 'error 2', 'error 3', 'error 4'], 'myfunction' ) );

			expect( paramsTester( { customer : 2000, type : 'something', isFlag : true } ).errors ).not.toBeDefined();
			expect( paramsTester( { customer : 2000, type : null, isFlag : false } ).errors ).not.toBeDefined();
			expect( paramsTester( { customer : 2000, type : '', isFlag : true, options : null } ).errors ).not.toBeDefined();
			expect( paramsTester( { customer : 2000, type : '', isFlag : true, options : { field : '' } } ).errors ).not.toBeDefined();

		} );



	} );


	describe( 'validateArgs', () => {


		it( 'should pass validation when params are valid', () => {

			//expect( argsTester( 2000, 'something', true, {} ) ).toBeNull();

		} );

	} );


	describe( 'requirementCheck', () => {


		it( 'should pass', () => {


		} );

	} );


	describe( 'typeCheck', () => {


		it( 'should ', () => {

		} );

	} );


	describe( 'getParamterError', () => {


		it( 'should ', () => {


		} );

	} );


});

