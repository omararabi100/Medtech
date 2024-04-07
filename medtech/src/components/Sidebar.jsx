import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

const usertype = localStorage.getItem('user');
console.log(usertype)
function SideBar({ translateXValue, showHide }) {
    return (
        <div className='side-bar-container'
            style={{
                transform: `translateX(${translateXValue}%)`,
                transition: 'transform 0.3s ease',
            }}
        >
            <div className='logo-container'>
                <img src="https://cdn-icons-png.flaticon.com/512/2099/2099192.png" className='logo-list' onClick={showHide} />
            </div>
            <div className="link-container-side">
                {usertype !== "Admin" && usertype !== "Doctor" && 
                    <>
                    <Link to="" onClick={showHide}>Home</Link>
                    <Link to="risk-prediction-tool" className={location.pathname === '/risk-prediction-tool' ? 'active' : ''} onClick={showHide}>Risk Prediction Tool</Link>
                    <Link to="get-checked" className={location.pathname === '/get-checked' ? 'active' : ''}onClick={showHide}>Get Checked</Link>
                    <Link to="call-now" className={location.pathname === '/call-now' ? 'active' : ''}onClick={showHide}>Call Now</Link>
                    <Link to="about-us" className={location.pathname === '/about-us' ? 'active' : ''}onClick={showHide}>About Us</Link>
                    <Link to="contact-us" className={location.pathname === '/contact-us' ? 'active' : ''}onClick={showHide}>Contact Us</Link>
                    </>
                }
                    {usertype=== "Doctor" && (
                        <>
                        <Link to="/dr-page" className={location.pathname === '/dr-page' ? 'active' : ''}>Doctor Page</Link>
                        <Link to="/calendar" className={location.pathname === '/calendar' ? 'active' : ''}>Calendar</Link>
                        </>
                    )}
                    {usertype === "Admin" && (
                    <li><Link to="/admin-page" className={location.pathname === '/admin-page' ? 'active' : ''}>Admin Page</Link></li>
                    )}
                    {(usertype === "User") && (
                        <>
                        <Link to="/my-profile" className={location.pathname === '/my-profile' ? 'active' : ''}>My Profile</Link>
                        </>
                    )}
                    {/* </> */}
                    {/* )} */}
                    
            </div>
        </div>
    )
}

export default SideBar;
