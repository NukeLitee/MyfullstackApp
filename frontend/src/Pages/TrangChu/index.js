import React from 'react';
import classNames from 'classnames';
import Header from '../../compoments/Layout/DefaultLayout/Header' ;
function TrangChu(props) {
    const cx = classNames.bind();
    return (
        <div>
            <Header/>
            <div className={cx()}>
                <h1>TrangChu</h1>
            </div>
        </div>
    );
}

export default TrangChu;