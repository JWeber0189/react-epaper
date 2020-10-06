import React from "react"
import './Epaper.scss'

import { Document, Page, pdfjs } from 'react-pdf'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

class EPAPER extends React.Component {
  constructor(props) {
    super(props);
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`
    this.state = {
      min_page: 1,
      max_page: parseInt(this.props.length),
      name: "wfv-info-2-2020",
      previous_pages: [],
      current_pages: [0, 1],
      next_pages: [2, 3],
      num_page: 1,
      page_width: 300,
      size: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };

    this.updateWindowDimensions = this.updateWindowDimensions.bind(this)

    this.dragX = -1
    this.dragY = -1
    this.direction_forward = true

    this.wrapper = {}

    const pages = this.getPagesFromHash()
    if (pages.length !== 0) {
      const p = this.generateAdjacentPages(pages)
      this.state.previous_pages = p.previous_pages
      this.state.current_pages = p.current_pages
      this.state.next_pages = p.next_pages
    }

    window.addEventListener("hashchange", () => {
      this.setPagesFromHash();
    });
  }

  dragPageStart(e) {
    this.dragX = -1
    this.dragY = -1

    e.preventDefault()
    this.dragX = e.layerX
    this.dragY = e.layerY
  }

  dragPageEnd(e) {
    if (this.dragX !== -1) {
      if (this.dragX < e.layerX) {
        this.previousPages()
      } else {
        this.nextPages()
      }
    }
    this.dragX = -1
  }

  getTranslateFromString(str) {
    let translate = -1.0
    try {
      translate = str.match(/translate.*\((.+)\)/)[1].split(', ')
      translate[0] = parseInt(translate[0].split("px")[0])
      translate[1] = parseInt(translate[1].split("px")[0])
    } catch (_) {
      this.drag.X = -1.0
      this.drag.Y = -1.0
    }
    return translate
  }

  nextPages() {
    const new_pages = [];

    if (this.state.current_pages[0] + 2 <= this.state.max_page) {
      const p0 = this.state.current_pages[0] + 2;
      new_pages[0] = p0;
      if (p0 + 1 <= this.state.max_page) {
        new_pages[1] = p0 + 1;
      }
    }

    if (new_pages.length !== 0) {
      const p = this.generateAdjacentPages(new_pages);
      this.direction_forward = true
      this.setState({
        previous_pages: p.previous_pages,
        current_pages: p.current_pages,
        next_pages: p.next_pages,
      });
    }
  }

  previousPages() {
    const new_pages = [];

    if (this.state.current_pages[0] - 1 >= this.state.min_page) {
      const p1 = this.state.current_pages[0] - 1;
      new_pages[1] = p1;
      if (p1 - 1 >= this.state.min_page) {
        new_pages[0] = p1 - 1;
      } else {
        new_pages[0] = 0;
      }
    }

    if (new_pages.length > 0) {
      const p = this.generateAdjacentPages(new_pages);
      this.direction_forward = false
      this.setState({
        previous_pages: p.previous_pages,
        current_pages: p.current_pages,
        next_pages: p.next_pages,
      });
    }
  }

  getPagesFromHash() {
    const pages = [];
    const hashpage = parseInt(window.location.hash.substr(1));

    if (hashpage >= this.state.min_page && hashpage <= this.state.max_page) {
      if (hashpage % 2 !== 1) {
        pages.push(hashpage);
        if (hashpage + 1 <= this.state.max_page) {
          pages.push(hashpage + 1);
        }
      } else {
        if (hashpage - 1 >= this.state.min_page) {
          pages.unshift(hashpage - 1);
        }
        pages.push(hashpage);
      }
    } else {
      // pages[0] = 1
    }
    return pages;
  }

  setPagesFromHash() {
    const pages = this.getPagesFromHash();
    if (pages.length !== 0) {
      pages.forEach((e) => {
        if (e < this.state.min_page || e > this.state.max_page) {
          return -1;
        }
      });
    }
    const p = this.generateAdjacentPages(pages);
    this.setState({
      previous_pages: p.previous_pages,
      current_pages: p.current_pages,
      next_pages: p.next_pages,
    });
  }

  generateAdjacentPages(new_current_pages) {
    const new_previous_pages = [];
    const new_next_pages = [];

    const p0 =
      new_current_pages.length > 1
        ? new_current_pages[1]
        : new_current_pages[0];

    new_previous_pages.unshift(new_current_pages[0] - 1);
    new_previous_pages.unshift(new_current_pages[0] - 2);

    new_next_pages.push(p0 + 1);
    new_next_pages.push(p0 + 2);

    return {
      previous_pages: new_previous_pages,
      current_pages: new_current_pages,
      next_pages: new_next_pages,
    };
  }

  generatePage(n) {
    return (
      <Page key={this.state.current_pages[n]}
        pageNumber={this.state.current_pages[n]}
        width={this.state.page_width}
        className={"active s" + n} />
    )
  }

  setPageSize(scaling_factor) {
    const wanted_width = this.state.size.width/2 * 0.85
    const wanted_height = this.state.size.height * 0.85

    if ((wanted_width * 7 / 5) < wanted_height) {
      this.setState({
        page_width: wanted_width
      })
    } else {
      this.setState({
        page_width: (wanted_height * 5 / 7)
      })
    }
  }

  updateWindowDimensions() {
    this.setState({
      size: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    })
    this.setPageSize(0.9)
  }

  render() {
    const items = [];
    const direction = this.direction_forward ? "dir-forwards" : "dir-backwards"

    const arrowLeft = (
      <div id="arrow-left" className={(this.state.current_pages.includes(0) ? "epaper-controls hidden" : "epaper-controls")}>
        <img src="/images/icons/chev_right.svg" alt="" width="35px" className="turned" />
      </div>
    );
    const arrowRight = (
      <div id="arrow-right" className={(this.state.current_pages.includes(this.state.max_page) ? "epaper-controls hidden" : "epaper-controls")}>
        <img src="/images/icons/chev_right.svg" alt="" width="35px" />
      </div>
    );
    const overlay = (
      <div draggable className="epaper-overlay" id="epaper-overlay"></div>
    );

    const temp = []
    for (let i = 0; i < this.state.current_pages.length; i++) {
      const p = this.state.current_pages[i];
      if (p !== 0 && p <= this.state.max_page) {
        temp.push(p)
      }
    }

    const pos = temp.length === 1 ? "center" : "drag-to-side"

    for (let i = 0; i < this.state.current_pages.length; i++) {
      const p = this.state.current_pages[i];
      if (p !== 0 && p <= this.state.max_page) {
        const element = this.generatePage(i)
        items.push(element)
      }
    }

    const markup = (
      <div className="epaper-container">
        <div className="epaper-frame">
          {arrowLeft}
          <div className="epaper-wrapper">
            {overlay}
            <Document file={ this.props.src }>
              <ReactCSSTransitionGroup
                transitionName="pageview"
                transitionEnterTimeout={750}
                transitionLeaveTimeout={740}
                className={"epaper-list " + direction + " pos-" + pos}>
                {items}
              </ReactCSSTransitionGroup>
            </Document>
          </div>
          {arrowRight}
        </div>
      </div>
    );

    return markup;
  }

  componentDidMount() {
    document
      .querySelector(".epaper-overlay")
      .addEventListener("dragstart", (e) => {
        this.dragPageStart(e);
      });
    document
      .querySelector(".epaper-overlay")
      .addEventListener("mouseup", (e) => {
        this.dragPageEnd(e);
      });
    document
      .querySelector("#arrow-right")
      .addEventListener("click", (_) => {
        this.nextPages();
      });
    document
      .querySelector("#arrow-left")
      .addEventListener("click", (_) => {
        this.previousPages();
      });

    this.updateWindowDimensions()
    window.addEventListener('resize', this.updateWindowDimensions)
  }
}

export default EPAPER
