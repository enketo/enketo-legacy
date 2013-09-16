describe( "Algorithm to split submission in chunks", function() {
	var t = [
		[
			[ 1000000, 2000000, 3000000, 4000000 ],
			[
				[ 0, 1 ],
				[ 2 ],
				[ 3 ]
			]
		],
		[
			[ 4000000, 1000000, 2000000, 3000000 ],
			[
				[ 0, 1 ],
				[ 2, 3 ]
			]
		],
		[
			[ 4000000, 2000000, 2000000, 1000000 ],
			[
				[ 0, 3 ],
				[ 1, 2 ]
			]
		],
		[
			[ 6000000, 1000000, 2000000, 6000000 ],
			[
				[ 0 ],
				[ 1, 2 ],
				[ 3 ]
			]
		],
		[
			[ 1000000, 2000000, 2000000, 3000000 ],
			[
				[ 0, 1, 2 ],
				[ 3 ]
			]
		],
		[
			[ 1000000, 1000000, 1000000, 1000000 ],
			[
				[ 0, 1, 2, 3 ]
			]
		],
		[
			[ 6000000 ],
			[
				[ 0 ]
			]
		]
	];

	var testBatchDivision = function( sizes, result ) {
		it( 'works as expected for: ' + JSON.stringify( sizes ), function() {
			expect( JSON.stringify( divideIntoBatches( sizes, 5000001 ) ) ).toEqual( JSON.stringify( result ) );
		} );
	};

	for ( var i = 0; i < t.length; i++ ) {
		testBatchDivision( t[ i ][ 0 ], t[ i ][ 1 ] );
	}
} );