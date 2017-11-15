
describe( 'Parameters', () => {

	let parameters =	require( '../lib/parameters' );

	let paramsTester =	( params ) => {

		return parameters.validateParams(
			params,
			{
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
					def :		{}
				}
			}
		);

	};

	let argsTester = 	( customer, type, isFlag, options ) => {

		return parameters.validateArgs(
			[
				{
					name :		'customer',
					value :		customer,
					required : 	true,
					type :		'number'
				},
				{
					name :		'type',
					value :		type,
					required :	false,
					type :		'string',
					def :		'my default'
				},
				{
					name :		'isFlag',
					value :		isFlag,
					required :	true
				},
				{
					name :		'options',
					value :		options,
					def :		{}
				}
			]
		);


	};


	describe( 'validateParams', () => {

		it( 'should pass validation when params are valid', () => {

			expect( paramsTester( { customer : 2000, type : 'something', isFlag : true } ).errors ).not.toBeDefined();
			expect( paramsTester( { customer : 2000, type : null, isFlag : false } ).errors ).not.toBeDefined();
			expect( paramsTester( { customer : 2000, type : '', isFlag : true, options : null } ).errors ).not.toBeDefined();
			expect( paramsTester( { customer : 2000, type : '', isFlag : true, options : { field : '' } } ).errors ).not.toBeDefined();

		} );

		it( 'should throw type errors when params are incorrect type', () => {

			// incorrect types on params that don't specify type
			expect( paramsTester( { customer : 2000, type : 'something', isFlag : 'blah', options : true } ).errors ).not.toBeDefined();

			// incorrect types on type-specific fields
			expect( paramsTester( { customer : '2000', type : 'something', isFlag : true } ).errors.length ).toBe( 1 );
			expect( paramsTester( { customer : 2000, type : 0, isFlag : true } ).errors.length ).toBe( 1 );
			expect( paramsTester( { customer : true, type : 0, isFlag : true } ).errors.length ).toBe( 2 );

		} );

		it( 'should throw errors when required params are missing', () => {

			// missing values on params that aren't required
			expect( paramsTester( { customer : 2000, type : null, isFlag : false } ).errors ).not.toBeDefined();

			// missing values on required fields
			expect( paramsTester( { customer : null, type : 'something', isFlag : true } ).errors.length ).toBe( 1 );
			expect( paramsTester( { customer : 2000, type : 'something' } ).errors.length ).toBe( 1 );
			expect( paramsTester( { customer : null, type : 'something' } ).errors.length ).toBe( 2 );

		} );

		it( 'should set missing params to the default value', () => {

			let params =	paramsTester( { customer : 2000, type : null, isFlag : false } );

			expect( params.type ).toEqual( 'my default' );
			expect( params.options ).toEqual( {} );

		} );

	} );


	describe( 'validateArgs', () => {


		it( 'should pass validation when arguments are valid', () => {

			expect( argsTester( 2000, 'something', true ).errors ).not.toBeDefined();
			expect( argsTester( 2000, null, false ).errors ).not.toBeDefined();
			expect( argsTester( 2000, '', true, null ).errors ).not.toBeDefined();
			expect( argsTester( 2000, '', true, { field : '' } ).errors ).not.toBeDefined();

		} );

		it( 'should return a params object with fields set', () => {

			let sampleOptions = [1,2,3];
			let params =		argsTester( 2000, 'something', true, sampleOptions );

			expect( params.customer ).toBe( 2000 );
			expect( params.type ).toBe( 'something' );
			expect( params.isFlag ).toBe( true );
			expect( params.options ).toBe( sampleOptions );

		} );

		it( 'should throw type errors when arguments are incorrect type', () => {

			// incorrect types on params that don't specify type
			expect( argsTester( 2000, 'something', 'blah', true ).errors ).not.toBeDefined();

			// incorrect types on type-specific fields
			expect( argsTester( '2000', 'something', true ).errors.length ).toBe( 1 );
			expect( argsTester( 2000, 0, true ).errors.length ).toBe( 1 );
			expect( argsTester( true, 0, true ).errors.length ).toBe( 2 );

		} );

		it( 'should throw errors when required arguments are missing', () => {

			// missing values on params that aren't required
			expect( argsTester( 2000, null, false ).errors ).not.toBeDefined();

			// missing values on required fields
			expect( argsTester( null, 'something', true ).errors.length ).toBe( 1 );
			expect( argsTester( 2000, 'something' ).errors.length ).toBe( 1 );
			expect( argsTester( null, 'something' ).errors.length ).toBe( 2 );

		} );

		it( 'should set empty arguments to the default value', () => {

			let params =	argsTester( 2000, null, false );

			expect( params.type ).toEqual( 'my default' );
			expect( params.options ).toEqual( {} )

		} );

	} );


	describe( 'requirementCheck', () => {

		it( 'should return true for valid requirements', () => {

			// required false is fine
			expect( parameters.requirementCheck( null, { required : false } ) ).toBe( true );
			expect( parameters.requirementCheck( undefined, { required : false } ) ).toBe( true );

			// no requirement parameter, assume required = false
			expect( parameters.requirementCheck( null ) ).toBe( true );
			expect( parameters.requirementCheck( undefined ) ).toBe( true );

			// some "falsy" values are okay
			expect( parameters.requirementCheck( 0, { required : true } ) ).toBe( true );
			expect( parameters.requirementCheck( false, { required : true } ) ).toBe( true );
			expect( parameters.requirementCheck( {}, { required : true } ) ).toBe( true );

		} );

		it( 'should return false for invalid requirements', () => {

			expect( parameters.requirementCheck( null, { required : true } ) ).toBe( false );
			expect( parameters.requirementCheck( undefined, { required : true } ) ).toBe( false );
			expect( parameters.requirementCheck( '', { required : true } ) ).toBe( false );

		} );

	} );


	describe( 'typeCheck', () => {

		it( 'should return true for valid data types', () => {

			// any or missing type is bypassed
			expect( parameters.typeCheck( 'string' ) ).toBe( true );
			expect( parameters.typeCheck( 'string', {} ) ).toBe( true );
			expect( parameters.typeCheck( null, { required : '' } ) ).toBe( true );
			expect( parameters.typeCheck( undefined ) ).toBe( true );
			expect( parameters.typeCheck( 'string', { type : 'any'} ) ).toBe( true );
			expect( parameters.typeCheck( null, { type : 'any'} ) ).toBe( true );
			expect( parameters.typeCheck( undefined, { type : 'any'} ) ).toBe( true );
			expect( parameters.typeCheck( null, { type : 'string' } ) ).toBe( false );
			expect( parameters.typeCheck( undefined, { type : 'string' } ) ).toBe( false );

			// matching data types
			expect( parameters.typeCheck( 'string', { type : 'string'} ) ).toBe( true );
			expect( parameters.typeCheck( true, { type : 'boolean'} ) ).toBe( true );
			expect( parameters.typeCheck( 0, { type : 'number'} ) ).toBe( true );
			expect( parameters.typeCheck( {}, { type : 'object'} ) ).toBe( true );
			expect( parameters.typeCheck( [], { type : 'object'} ) ).toBe( true );
			expect( parameters.typeCheck( null, { type : 'undefined'} ) ).toBe( true );

		} );

		it( 'should return false for invalid data types', () => {

			expect( parameters.typeCheck( true, { type : 'string' } ) ).toBe( false );
			expect( parameters.typeCheck( 'hello', { type : 'object' } ) ).toBe( false );
			expect( parameters.typeCheck( 10, { type : 'boolean' } ) ).toBe( false );
			expect( parameters.typeCheck( true, { type : 'number' } ) ).toBe( false );

		} );

	} );


	describe( 'getParamterError', () => {


		it( 'should generate an error object with a nicely formatted error', () => {

			var error =	parameters.getParamterError( ['error 1', 'error 2', 'error 3', 'error 4'], 'myfunction' );

			expect( typeof error ).toBe( 'object' );
			expect( typeof error.message ).toBe( 'string' );
			expect( error.message ).toBe( 'Parameter validation failed for myfunction()\n\terror 1\n\terror 2\n\terror 3\n\terror 4' );

		} );

	} );


});

