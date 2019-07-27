import React from 'react';
import logo from './logo.svg';
import './App.css';

const wrapperStyle = {
  height: '820px',
  display: 'flex',
  flexDirection: 'row',
  border: '1px solid black',
  overflow: 'auto',
}

const gridWrapper = {
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  position: 'relative',
}

const gridWrapperStyle = (height) => {
  return {
    ...gridWrapper,
    height: `${height}px`,
  }
}

const getStyleProp = (str) => Number(str.replace('px', ''));

class MagicGrid extends React.Component {
  constructor(props) {
    super(props);
    this.gridWrapper = React.createRef();
    this.getStyleProps = this.getStyleProps.bind(this);
    this.wrapperRef = React.createRef();
    this.state = {
      start: 0,
      end: 0,
    }
  }

  componentDidMount() {
    const { height } = this.getWrapperStyle();
    this.setState({
      end: Math.ceil(height / this.props.rowHeight),
    })
  }

  getWrapperStyle(wrapper = this.wrapperRef) {
    const wrapperStyles = window.getComputedStyle(wrapper.current);
    const height = getStyleProp(wrapperStyles.height);
    return { height };
  }

  getStyleProps() {
    const { height } = this.getWrapperStyle();
    const currentScollTop = this.wrapperRef.current.scrollTop;
    const { rowHeight } = this.props;
    let maxVisibleRows = Math.ceil(height / rowHeight);
    let startIndex = 0;
    let endIndex;
    let currentIndex = Math.floor(currentScollTop / rowHeight);

    if (currentIndex > 0) startIndex = currentIndex
    endIndex = maxVisibleRows + currentIndex;

    this.setState({
      start: startIndex,
      end: endIndex,
      scrollTop: currentScollTop
    })
  }

  ren(r) {
    return <div style={{ display: 'flex', flexDirection: 'column' }}>{r}</div>;
  }

  render() {
    return (
      <div
        ref={this.wrapperRef}
        onScroll={this.getStyleProps}
        style={wrapperStyle}>
        <div ref={this.gridWrapper} style={gridWrapperStyle(this.props.totalRows * this.props.rowHeight)}>
          {
            this.state.end > 0 &&
            this.ren(this.props.children(this.state.start, this.state.end, this.state.scrollTop))
          }
        </div>
      </div>
    )
  }
}

class Row extends React.Component {
  constructor(props) {
    super(props);
    this.updateBg = this.updateBg.bind(this);
    this.state = {
      over: false,
    }
  }

  updateBg(val) {
    this.setState({
      over: val
    })
  }

  render() {
    return <div
      onMouseOut={() => { this.updateBg(false) }}
      onMouseOver={() => { this.updateBg(true) }}
      style={{ display: 'flex', width: '100%', height: '40px', background: this.state.over ? 'salmon' : '' }}>
      {this.props.number} Lorem Ipsum has been the industry's standard dummy text ever since the 1500s
  </div>
  }
}

function App() {
  const arr = Array(4000);
  for (let i = 0; i < 4000; i++) {
    arr[i] = i;
  }

  const getRows = (start, end, scrollTop) => {
    if (start === -1 || end === -1) return null;

    let startIndex = start;
    let endIndex = end;
    let offset = 0;

    if (start > 2) {
      startIndex = start - 1;
    } else {
      endIndex = end + 1;
    }

    if (end > 3980) {
      offset = 1;
    }

    const slice = arr.slice(
      startIndex,
      endIndex
    );

    if (slice && slice.length) {
      const tmp = slice.map((num) => {
        return <Row number={num} />
      })

      if (start) {
        let first = [];
        let rest = Math.floor(scrollTop / 40);
        for (let i = 0; i < rest - offset; i++) {
          first.push(<div style={{ height: '40px' }}></div>);
        }
        return first.concat(tmp);
      }
      return tmp;
    }
  }

  return (
    <div className="App">
      <div style={{ marginTop: '50px' }}>
        <MagicGrid
          totalRows={4000}
          rowHeight={40}>
          {(start, end, scrollTop) => {
            return getRows(start, end, scrollTop)
          }}
        </MagicGrid>
      </div>
    </div>
  );
}

export default App;
