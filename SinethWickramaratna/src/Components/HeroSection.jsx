import './HeroSection.css';
import { useState, useEffect } from 'react';

function HeroSection(){
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Trigger animation after component mounts
        setTimeout(() => setIsLoaded(true), 100);
    }, []);

    return(
        <>
          <div className="hero-section">
            <div className="hero-container">
              <div className="hero-content">
                <h1 className={`hero-title ${isLoaded ? 'loaded' : ''}`}>
                  SINETH WICKRAMARATNA
                </h1>
                <div className="neural-accent"></div>
                <p className="hero-subtitle">Computer Science & Engineering Student at University of Moratuwa</p>
                <div className="stream-box">
                  <p className="hero-subtitle stream-label">Stream : Data Science Engineering</p>
                </div>
                <p className="hero-description">
                  Transforming data into insights through AI, Machine Learning, and innovative solutions
                </p>
                <div className="button-group">
                  <button className="btn-primary">Get In Touch</button>
                  <button className="btn-secondary">
                    <svg className="download-icon" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                      <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                    </svg>
                    Download CV
                  </button>
                </div>
              </div>
              
              {/* Desk Scene Animation */}
              <div className={`desk-animation ${isLoaded ? 'loaded' : ''}`}>
                <div className="desk-scene">

                  {/* Window */}
                  <div className="wall-window">
                    <div className="window-sky">
                      <div className="window-moon"></div>
                      <div className="window-star star-1"></div>
                      <div className="window-star star-2"></div>
                      <div className="window-star star-3"></div>
                      <div className="window-star star-4"></div>
                      <div className="window-star star-5"></div>
                    </div>
                    <div className="window-frame-h"></div>
                    <div className="window-frame-v"></div>
                    <div className="window-sill"></div>
                  </div>

                  {/* Bookshelf (behind table) */}
                  <div className="bookshelf">
                    <div className="shelf-back"></div>
                    <div className="shelf shelf-top">
                      <div className="shelf-board"></div>
                      <div className="shelf-books">
                        <div className="sbook sbook-1"></div>
                        <div className="sbook sbook-2"></div>
                        <div className="sbook sbook-3"></div>
                        <div className="sbook sbook-4"></div>
                        <div className="sbook sbook-5"></div>
                        <div className="sbook sbook-6"></div>
                        <div className="sbook sbook-7"></div>
                        <div className="sbook sbook-8"></div>
                        <div className="sbook sbook-9"></div>
                        <div className="sbook sbook-10"></div>
                      </div>
                    </div>
                    <div className="shelf shelf-mid">
                      <div className="shelf-board"></div>
                      <div className="shelf-books">
                        <div className="sbook sbook-11"></div>
                        <div className="sbook sbook-12"></div>
                        <div className="sbook sbook-13"></div>
                        <div className="sbook sbook-14"></div>
                        <div className="sbook sbook-15"></div>
                        <div className="sbook sbook-16"></div>
                        <div className="sbook sbook-17"></div>
                        <div className="sbook sbook-18"></div>
                        <div className="shelf-decor"></div>
                      </div>
                    </div>
                    <div className="shelf shelf-mid2">
                      <div className="shelf-board"></div>
                      <div className="shelf-books">
                        <div className="sbook sbook-19"></div>
                        <div className="sbook sbook-20"></div>
                        <div className="sbook sbook-21"></div>
                        <div className="sbook sbook-22"></div>
                        <div className="sbook sbook-23"></div>
                        <div className="sbook sbook-24"></div>
                        <div className="sbook sbook-25"></div>
                        <div className="sbook sbook-26"></div>
                      </div>
                    </div>
                    <div className="shelf shelf-bot">
                      <div className="shelf-board"></div>
                      <div className="shelf-books">
                        <div className="sbook sbook-27"></div>
                        <div className="sbook sbook-28"></div>
                        <div className="sbook sbook-29"></div>
                        <div className="sbook sbook-30"></div>
                        <div className="sbook sbook-31"></div>
                        <div className="sbook sbook-32"></div>
                        <div className="sbook sbook-33"></div>
                        <div className="sbook sbook-34"></div>
                        <div className="sbook sbook-35"></div>
                      </div>
                    </div>
                    <div className="shelf-side shelf-side-l"></div>
                    <div className="shelf-side shelf-side-r"></div>
                  </div>

                  {/* Hanging Light Bulb */}
                  <div className="hanging-light">
                    <div className="light-wire"></div>
                    <div className="light-socket"></div>
                    <div className="light-bulb-glass">
                      <div className="light-filament"></div>
                    </div>
                    <div className="light-glow"></div>
                  </div>

                  {/* Headphones (side view, lying on table) */}
                  <div className="desk-headphones">
                    <div className="hp-band"></div>
                    <div className="hp-cup hp-cup-l">
                      <div className="hp-cushion"></div>
                    </div>
                    <div className="hp-cup hp-cup-r">
                      <div className="hp-cushion"></div>
                    </div>
                  </div>

                  {/* Laptop */}
                  <div className="laptop-wrapper">
                    {/* Screen Lid */}
                    <div className="screen-lid">
                      <div className="screen-bezel">
                        <div className="screen-camera"></div>
                        <div className="screen-display">
                          <div className="code-editor">
                            <div className="editor-dots">
                              <span className="dot dot-red"></span>
                              <span className="dot dot-yellow"></span>
                              <span className="dot dot-green"></span>
                            </div>
                            <div className="code-content">
                              <div className="code-row typing-line">
                                <span className="code-keyword">import</span>{' '}
                                <span className="code-string">torch</span>{' '}
                                <span className="code-keyword">as</span>{' '}
                                <span className="code-var">nn</span>
                              </div>
                              <div className="code-row typing-line">
                                <span className="code-keyword">def</span>{' '}
                                <span className="code-func">train_model</span>
                                <span className="code-var">(data):</span>
                              </div>
                              <div className="code-row typing-line">
                                <span className="code-string">&nbsp;&nbsp;model</span>{' '}
                                <span className="code-keyword">=</span>{' '}
                                <span className="code-func">NeuralNet</span>
                                <span className="code-var">()</span>
                              </div>
                              <div className="code-row typing-line">
                                <span className="code-string">&nbsp;&nbsp;loss</span>{' '}
                                <span className="code-keyword">=</span>{' '}
                                <span className="code-func">compute</span>
                                <span className="code-var">(pred)</span>
                              </div>
                              <div className="code-row typing-line">
                                <span className="code-keyword">&nbsp;&nbsp;return</span>{' '}
                                <span className="code-var">accuracy</span>
                              </div>
                            </div>
                            <div className="editor-cursor"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Laptop Body / Keyboard */}
                    <div className="laptop-body">
                      <div className="keyboard-area">
                        {[...Array(30)].map((_, i) => (
                          <div key={i} className={`kb-key ${i % 5 === 0 ? 'kb-active' : ''}`}></div>
                        ))}
                      </div>
                      <div className="trackpad"></div>
                    </div>
                  </div>

                  {/* Mouse */}
                  <div className="desk-mouse">
                    <div className="mouse-body">
                      <div className="mouse-wheel"></div>
                    </div>
                  </div>

                  {/* Coffee Mug */}
                  <div className="coffee-mug">
                    <div className="mug-body"></div>
                    <div className="mug-handle"></div>
                    <div className="steam">
                      <div className="steam-line steam-1"></div>
                      <div className="steam-line steam-2"></div>
                      <div className="steam-line steam-3"></div>
                    </div>
                  </div>

                  {/* Book Stack */}
                  <div className="book-stack">
                    <div className="book book-1"></div>
                    <div className="book book-2"></div>
                    <div className="book book-3"></div>
                  </div>

                  {/* Phone */}
                  <div className="desk-phone">
                    <div className="phone-body">
                      <div className="phone-screen">
                        <div className="phone-notif"></div>
                        <div className="phone-notif phone-notif-2"></div>
                      </div>
                    </div>
                  </div>

                  {/* Pen Holder */}
                  <div className="pen-holder">
                    <div className="holder-body"></div>
                    <div className="pen pen-1"></div>
                    <div className="pen pen-2"></div>
                    <div className="pen pen-3"></div>
                  </div>

                  {/* Desk Surface */}
                  <div className="desk-surface">
                    <div className="desk-edge"></div>
                  </div>
                  <div className="desk-legs">
                    <div className="desk-leg desk-leg-l"></div>
                    <div className="desk-leg desk-leg-r"></div>
                  </div>

                  {/* Desk Reflection */}
                  <div className="desk-glow-reflection"></div>
                </div>
              </div>
            </div>
          </div>
        </>
    );
}

export default HeroSection;