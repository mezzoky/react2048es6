import React from 'react';
import Board from './board';

class Cell extends React.Component {
    shouldComponentUpdate() {
        return false;
    }
    render() {
        return <span className='cell'>{''}</span>;
    }
}

class Row extends React.Component {
    shouldComponentUpdate() {
        return false;
    }
    render() {
        let row = this.props.row.map(()=>{
            return <Cell/>;
        });
        return <div>{row}</div>;
    }
}

class Tile extends React.Component {
    shouldComponentUpdate(nextProps) {
        if (this.props.tile != nextProps.tile) {
            return true;
        }
        if (!nextProps.tile.hasMoved() && !nextProps.tile.isNew()) {
            return false;
        }
        return true;
    }
    render() {
        let tile = this.props.tile;
        let classNames = ['tile', 'tile' + tile.value];
        if (!tile.mergedInto) {
            classNames.push('position_' + tile.row + '_' + tile.col);
        } else {
            classNames.push('merged');
        }
        if (tile.isNew()) {
            classNames.push('new');
        } else {
            classNames.push('row_from_' + tile.fromRow() + '_to_' + tile.toRow());
            classNames.push('column_from_' + tile.fromCol() + '_to_' + tile.toCol());
            classNames.push('isMoving');
        }
        classNames = classNames.join(' ');
        return (
            <span className={classNames} key={tile.id}>{tile.value}</span>
        );
    }
}

class Game extends React.Component {
    constructor(...args) {
        super(...args);
        this.state = {
            board: new Board()
        };
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }
    componentDidMount() {
        window.addEventListener('keydown', this.handleKeyDown);
    }
    componentWillUnmount() {
        window.removeEventListener('keydown', this.handleKeyDown);
    }
    handleKeyDown(event) {
        if (event.keyCode >= 37 && event.keyCode <= 40) {
            event.preventDefault();
            let direction = event.keyCode - 37;
            this.setState({
                board: this.state.board.move(direction)
            });
        }
    }
    render() {
        let board = this.state.board;
        let cells = board.cells.map(row=><Row row={row}/>);
        let tiles = board.tiles.filter((tile)=>tile.value).map((tile)=><Tile tile={tile}/>);

        let print = function(e) {
            console.log(e);
        };
        return (
            <div className='board' onTouchStart={print} onKeyDown={print}
            onKeyPress={print} onKeyUp={print}>
                {cells}
                {tiles}
            </div>
        );
    }
}

export default Game;
