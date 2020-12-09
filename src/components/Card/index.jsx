import React from 'react';

import './index.less';

export default function Card({items, history}) {
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
