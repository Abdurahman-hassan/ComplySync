// LandingPage.js
import React, { useState, useEffect } from 'react';
import './LandingPage.css';

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
                    <button className="btn-deployed-app">Go to App</button>
                </div>
            </header>

            <section id="features" className="features">
                <div className="feature">
                    <img src="/policies_feature.png" alt="Policies Feature" />
                    <div className="feature-description">
                        <h2>Policies</h2>
                        <p>Clearly define and manage your company policies. Create new policies, assign descriptive titles, and provide detailed explanations for easy employee understanding.</p>
                    </div>
                </div>
                <div className="feature">
                <img src="/groups_feature.png" alt="Groups Feature" className="group-image" />
                    <div className="feature-description group-description">
                        <h2>Groups</h2>
                        <p>Organize your workforce effectively. Create groups based on departments, roles, or any other relevant criteria. This allows targeted communication, ensuring employees only see policies relevant to their function.</p>
                    </div>
                </div>
                <div className="feature">
                    <img src="/campaigns_feature.png" alt="Campaigns Feature" />
                    <div className="feature-description">
                        <h2>Campaigns</h2>
                        <p>Simplify policy rollouts with targeted campaigns. Designate specific campaigns, define their duration, and select the relevant groups and policies to include. Once a campaign is launched,  employees are automatically notified of the new or updated policies that apply to them.</p>
                    </div>
                </div>
            </section>

            <section id="about" className="about">
                <h2>About ComplySync</h2>
                <p><i className="fa-solid fa-quote-left"></i>
                ComplySync was born out of a conversation with a friend who shared the frustrations they faced with integrating company policies and keeping employees informed.  They, like many companies, were shelling out significant sums to online tools that handled these tasks inefficiently.  This was in april 2024 (we were both Holberton School students at the time!), and the idea sparked a fire within us.
                We envisioned a simpler, more cost-effective solution: a tool dedicated solely to notifying employees of new policies.  With that goal in mind, we embarked on a journey to define the project's requirements, the technologies needed, and the all-important Minimum Viable Product (MVP).  We meticulously crafted specifications, designed the architecture, built a data model, and outlined user stories – all the building blocks necessary to bring ComplySync to life.
                This project is not just about creating a useful tool; it's a testament to the skills and knowledge we honed at Holberton School.  ComplySync serves as our Portfolio Project, a culmination of the problem-solving and development expertise we acquired during our time there.<i className="fa-solid fa-quote-right"></i>
                </p>
                <div className="team-member">
                    <a href="https://linkedin.com/in/abdelrahman-hassan-hamdy" target="_blank" rel="noreferrer"><i className="fa-brands fa-linkedin"></i>Abdelrahman Hassan</a>
                    <a href="https://github.com/Abdurahman-hassan" target="_blank" rel="noreferrer"><i className="fa-brands fa-github"></i>Abdelrahman Hassan</a>
                    <a href="https://dev.to/3bdelrahman" target="_blank" rel="noreferrer"><i className="fa-brands fa-dev"></i>Abdelrahman Hassan</a>
                </div>
                <div className="team-member">
                    <a href="https://linkedin.com/in/mojtaba-mohamed" target="_blank" rel="noreferrer"><i className="fa-brands fa-linkedin"></i>Mugtaba Mohamed</a>
                    <a href="https://github.com/mojmo" target="_blank" rel="noreferrer"><i className="fa-brands fa-github"></i>Mugtaba Mohamed</a>
                    <a href="https://twitter.com/MOJMO_" target="_blank" rel="noreferrer"><i className="fa-brands fa-twitter"></i>Mugtaba Mohamed</a>
                </div>
                <a className='repo' href="https://github.com/Abdurahman-hassan/ComplySync" target="_blank" rel="noreferrer"><i className="fa-brands fa-github"></i>GitHub Repository</a>
            </section>
        </div>
    );
};

export default LandingPage;
