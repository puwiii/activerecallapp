import React from 'react'

function Layout({children}) {
    return (
        <div>
            {
                children
            }
            <style jsx>{`
                div{
                    min-height:100vh;
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: 0;
                    right: 0;
                }
            `}</style>
        </div>

    )
}

export default Layout
