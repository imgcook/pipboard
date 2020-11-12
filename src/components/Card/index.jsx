import React, { Component } from 'react';

import './index.scss';

export default class Card extends Component {
  render() {
    const { items, history } = this.props;
    return (
        <div className="card-wrapper">
          {items.map((item, idx) => {
            return (
              <div
                key={idx}
                className="card-item"
                onClick={() => history.push(item.path)}
              >
                <img
                  className="card-img"
                  src={item.cover}
                  alt=""
                />
                <h5 className="card-title">{item.title}</h5>
                <p className="card-desc">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
    );
  } 
}
