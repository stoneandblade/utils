
describe( 'Parameters', () => {

	let parameters =	require( '../lib/parameters' );


	describe( 'validate', () => {

		it( 'should', () => {

			let tester = ( params ) => {

				parameters.validate( params, {
					customer  : {
						required : true
					}
				} );

			};


			tester( {} );
			tester( { customer : 2000 } );

		} );

		it( 'should', () => {

			let tester = ( customer, type, booleanFlag ) => {

				parameters.validate( arguments, {
					customer  : {
						required : true
					}
				} );

			};


			tester();
			tester( 2000 );
			tester( 2000, 'abc', true );

		} );


	} );

});

