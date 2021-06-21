import React from 'react'
import styles from '../styles/Home.module.scss'

function Layout({children}) {
    return (
        <div className="layout">
            {
                children
            }
            <style jsx>{`
                .layout{
                    max-width: 100vw;
                    height:100vh;
                    max-height: 100vh;
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    display: flex;
                    flex-direction: column;
                    overflow-x: hidden;
                }
            `}</style>
        </div>

    )
}

export default Layout
