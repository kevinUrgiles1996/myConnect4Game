class Connect4 {

  constructor(selector) {
    this.selector = selector;
    this.player = 'red';
    this.ROWS = 6;
    this.COLS = 7;
    this.createGrid();
    this.setupEventListeners();
  }

  createGrid() {

    const $board = $(this.selector);

    for (let row = 0; row < this.ROWS; row++) {
      const $row = $('<div>').addClass('row');
      for (let col = 0; col < this.COLS; col++) {
        const $col = $('<div>').addClass('col empty').
        attr('data-col', col).
        attr('data-row', row);
        $row.append($col);
      }

      $board.append($row);
    }
  }

  setupEventListeners() {

    const $board = $(this.selector);
    const that = this;

    function findLastEmptyCell(col){
      const cells = $(`.col[data-col=${col}]`);
      for (let i = cells.length - 1; i >=0; i--){
        const actuallCell = $(cells[i]);
        if (actuallCell.hasClass('empty')){
          return actuallCell;
        }
      }

      return null;

    }

    $board.on('mouseenter','.col.empty',function(){
      const col = $(this).data('col');
      const lastEmptyCell = findLastEmptyCell(col);
      lastEmptyCell.addClass(`next-${that.player}`);
    });

    $board.on('mouseleave','.col',function(){
      $('.col').removeClass(`next-${that.player}`);
    });

    $board.on('click','.col.empty',function(){

      const col = $(this).data('col');
      const lastEmptyCell = findLastEmptyCell(col);
      lastEmptyCell.removeClass(`empty next-${that.player}`);
      lastEmptyCell.addClass(that.player);
      lastEmptyCell.data('player', that.player); //(3)

      //New (1)
      const winner = that.checkForWinner(
        lastEmptyCell.data('row'),
        lastEmptyCell.data('col'));

      if(winner){
        alert(`Game Over! ${that.player} has won`); //New (2)
        $('.col.empty').removeClass('empty'); // To avoid continue playing the game
        return;
      }

      that.player = (that.player === 'red') ? 'black' : 'red';
      $(this).trigger('mouseenter');

    });

  }

  checkForWinner(row,col){ //New (4)

    const that = this;

    function $getCell(i,j){
      return $(`.col[data-row=${i}][data-col=${j}]`);
    }

    function checkDirection(direction){
      let total = 0;
      let i = row + direction.i;
      let j = col + direction.j;
      let $next = $getCell(i,j);
      while (i >=0 &&
             i <= that.ROWS &&
             j >=0 &&
             j <= that.COLS &&
             $next.data('player') === that.player
      ){
        total++;

        i += direction.i;
        j += direction.j;
        $next = $getCell(i,j);

      }

      return total;
    }

    function checkWin(directionA, directionB){
      const total = 1 + checkDirection(directionA) + checkDirection(directionB);

      if (total >= 4){
        return that.player;
      } else{
        return null;
      }

    }

    function checkVerticals(){
      return checkWin({i:-1,j:0},{i:1,j:0});
    }

    function checkHorizontals(){
      return checkWin({i:0,j:1},{i:0,j:-1});
    }

    function checkPositiveDiagonal(){
      return checkWin({i:1,j:-1},{i:-1,j:1});
    }

    function checkNegativeDiagonal(){
      return checkWin({i:1,j:1},{i:-1,j:-1});
    }

    return checkVerticals() ||
           checkHorizontals() ||
           checkPositiveDiagonal() ||
           checkNegativeDiagonal();
  }



}
