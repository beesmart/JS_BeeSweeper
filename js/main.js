

window.onload = function(){

var board = $("#main-container"),
	firstClick = false,
	counter = 1;



	function createBoard(v){



	  	// Create 9 rows
	    for (var i = 0; i < v; i++){
	       row = document.createElement("div");
	       row.className = "row " + "row" + i;
	       row.setAttribute("data-row", i)   
	       // Create cells
	       for(var j=0; j < v; j++){
	        cell = document.createElement("div");
	     	// token = document.createElement("div");
	        cell.className = "cell " + "cell" + j;
	        cell.setAttribute("data-cell", j)
	        // token.className = "token";
	        row.appendChild(cell);
	        // cell.appendChild(token);

	       }

	       board.append(row)
	    }
	    // Create the matrix - Our "back-end" logic that connects to the front-end grid we created above.
	    // We work with the matrix to deal wth the computations and conditional logic that allows our
	    // game to come alive.
	    matrix = new Array(9);
		for (var i = 0; i < matrix.length; i++) {
		matrix[i] = new Array(9);
		}


	} //createBoard END


createBoard(9)


	$( ".cell" ).click(function() {

		

		// alert($(this).attr('class') + $(this).parent().attr('class'))
		clickedRow = $(this).parent().attr('data-row') 
		clickedCell = $(this).attr("data-cell")

		$(this).css("background", "rgb(45, 174, 45)") // change cell background
		
		if (firstClick === false) {

			matrix[clickedRow][clickedCell] = 1 // Set this square as start square
			firstClick = true;
			console.log(firstClick)
			matrix = placeMines(matrix)
			renderMines(matrix)
			renderClues(matrix)

		} // FirstClick check


	}) // End (.cell).click


	function placeMines(matrix) {

		// create 10 mines
		// Generate a random X and Y co-ord
		for (var i = 0; i < 10; i++) {
			
			var randomX = Math.round(Math.random() * 8),
				randomY = Math.round(Math.random() * 8);
			// check we dont place a mine in our start point	
			while (matrix[randomX][randomY] === 1){
				randomX = Math.round(Math.random() * 8);
				randomY = Math.round(Math.random() * 8);
				console.log("stopped starting sq mine placement")
			}
			// check we dont place a mine on a spot that already has an existing mine
			while (matrix[randomX][randomY] === "mined"){
				randomX = Math.round(Math.random() * 8);
				randomY = Math.round(Math.random() * 8);
				console.log("stopped repeated mine placement")
			}

			// assign the mine to the matrix
			matrix[randomX][randomY] = "mined"
			
		};

		for (var x = 0; x < matrix.length; x++) {
			for (var y = 0; y < matrix[0].length; y++) {
				if (matrix[x][y] !== "mined") {matrix[x][y] = "free"}
		}}
		// Check that the random number wont place on the starting square, if so, roll again
			
			return matrix

	} // END placemines	

	// Render the mines
	function renderMines(matrix){

		// Cycle the matrix looking for the mined spots
		for (var x = 0; x < matrix.length; x++) {
			for (var y = 0; y < matrix[0].length; y++) {
				if (matrix[x][y] === "mined") {
							
						// console.log("x is " + (x) + " y is " + (y))
						
						$(".row" + x).find(".cell" + y).css("background", "blue")	
					
				}

				

			}

		}

	} // End RenderMines

	

	function renderClues(matrix){

		for (var x = 0; x < matrix.length; x++) {
			for (var y = 0; y < matrix[0].length; y++) {

				if (matrix[x][y] === "free") {
						counter = 1
						if (x !== 8 && matrix[x+1][y] === "mined") {
							$(".row" + x).find(".cell" + y).text(counter++)
						}	

						if (x !== 8 && matrix[x+1][y+1] === "mined") {
							$(".row" + x).find(".cell" + y).text(counter++)
						}

						if (x !== 8 && matrix[x+1][y-1] === "mined") {
							$(".row" + x).find(".cell" + y).text(counter++)
						}

						if (matrix[x][y+1] === "mined") {
							$(".row" + x).find(".cell" + y).text(counter++)
						}

						if (matrix[x][y-1] === "mined") {
							$(".row" + x).find(".cell" + y).text(counter++)
						}

						if (x !== 0 && matrix[x-1][y-1] === "mined") {
							$(".row" + x).find(".cell" + y).text(counter++)
						}

						if (x !== 0 && matrix[x-1][y] === "mined") {
							$(".row" + x).find(".cell" + y).text(counter++)
						}

						if (x !== 0 && matrix[x-1][y+1] === "mined") {
							$(".row" + x).find(".cell" + y).text(counter++)
						}		


				}
			}
		}
	}

} // End

