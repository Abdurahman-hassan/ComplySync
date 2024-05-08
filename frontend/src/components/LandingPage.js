// LandingPage.js
import React, { useState, useEffect } from 'react';
import '../styles/LandingPage.css';
import { NavLink } from 'react-router-dom';

const LandingPage = () => {

    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            setIsScrolled(scrollTop > 0);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isScrolled]);

    return (
        <div className="landing-page">
            <nav className={isScrolled ? 'navigation scrolled' : 'navigation'}>
                <a className='logo' href="#home">ComplySync</a>
                <div className="links">
                    <a href="#features">Features</a>
                    <a href="#about">About</a>
                </div>
            </nav>
            <header className="header">
                <img src="/cover_illustration.svg" alt="Cover" className="cover-image" />
                <div className="project-description">
                    <h1>ComplySync</h1>
                    <p>Seamless policy integration<br />for easy access</p>
                    <NavLink to="/login"><button className="btn-deployed-app">Go to App</button></NavLink>
                </div>
            </header>

            <section id="features" className="features">
                <div className="feature">
                    <img src="/policies_feature.png" alt="Policies Feature" />
                    <div className="feature-description">
                        <h2>Policies</h2>
                        <p>Description of Feature 1</p>
                    </div>
                </div>
                <div className="feature">
                    <div className="feature-description">
                        <h2>Groups</h2>
                        <p>Description of Feature 2</p>
                    </div>
                    <img src="/groups_feature.png" alt="Groups Feature" />
                </div>
                <div className="feature">
                    <img src="/campaigns_feature.png" alt="Campaigns Feature" />
                    <div className="feature-description">
                        <h2>Campaigns</h2>
                        <p>Description of Feature 3</p>
                    </div>
                </div>
            </section>

            <section id="about" className="about">
                <h2>About ComplySync</h2>
                <p><i className="fa-solid fa-quote-left"></i>Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus aperiam eos quam? Voluptatem, harum vero explicabo cupiditate ad quaerat at dolore doloribus, iste molestias cumque? Nemo fuga magni natus nihil?<i className="fa-solid fa-quote-right"></i></p>
                <div className="team-member">
                    <a href="https://linkedin.com/in/member1"><i className="fa-brands fa-linkedin"></i>Member 1 LinkedIn</a>
                    <a href="https://github.com/member1"><i className="fa-brands fa-github"></i>Member 1 GitHub</a>
                    <a href="https://twitter.com/member1"><i className="fa-brands fa-twitter"></i>Member 1 Twitter</a>
                </div>
                <div className="team-member">
                    <a href="https://linkedin.com/in/member1"><i className="fa-brands fa-linkedin"></i>Member 2 LinkedIn</a>
                    <a href="https://github.com/member1"><i className="fa-brands fa-github"></i>Member 2 GitHub</a>
                    <a href="https://twitter.com/member1"><i className="fa-brands fa-twitter"></i>Member 2 Twitter</a>
                </div>
                <a className='repo' href="https://github.com/your-repo"><i className="fa-brands fa-github"></i>GitHub Repository</a>
            </section>
        </div>
    );
};

export default LandingPage;
