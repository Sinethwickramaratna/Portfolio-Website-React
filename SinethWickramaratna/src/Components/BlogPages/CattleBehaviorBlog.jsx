import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../public/Footer';
import './CattleBehaviorBlog.css';

function CattleBehaviorBlog() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className="blog-article-page">
        <header className="blog-article-header">
          <button className="blog-back-button" onClick={() => navigate('/')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Portfolio
          </button>

          <p className="blog-article-category">IoT + Machine Learning</p>
          <h1 className="blog-article-title">
            From Sensors to Insights: Detecting Cattle Behavior Using IoT, Feature Engineering, and Machine Learning
          </h1>
          <p className="blog-article-subtitle">
            Building an end-to-end livestock intelligence pipeline from wearable sensor streams to behavior prediction APIs.
          </p>
        </header>

        <article className="blog-article-content">
          <section>
            <p>
              Modern agriculture is rapidly evolving with the integration of Artificial Intelligence (AI) and Internet of Things (IoT) technologies. One significant challenge in livestock farming is efficiently monitoring animal behavior. Traditionally, farmers observe cattle behavior manually, but this method becomes impractical as herd sizes increase.
            </p>
            <p>
              Imagine if we could automatically detect cattle behavior using wearable sensors and machine learning!
            </p>
            <p>
              In this project, I developed a machine learning model that predicts cattle behavior using motion sensor data collected from a wearable IoT device. This model can recognize behaviors such as:
            </p>
            <ul>
              <li>Grazing</li>
              <li>Walking</li>
              <li>Standing</li>
              <li>Resting</li>
              <li>Shaking</li>
            </ul>
            <p>
              By analyzing movement patterns, the system can help farmers monitor livestock health and activity automatically.
            </p>

            <figure className="blog-image-figure">
              <img src="/blog/cattle-iot-hero.svg" alt="Cattle wearing IoT collar and cloud analytics flow" loading="lazy" />
              <figcaption>Figure 1: High-level concept of IoT-based cattle behavior monitoring.</figcaption>
            </figure>
          </section>

          <section>
            <h2>Why Detect Cattle Behavior?</h2>
            <p>
              Monitoring behavior provides valuable insights, including:
            </p>
            <ul>
              <li>Animal health</li>
              <li>Feeding patterns</li>
              <li>Stress detection</li>
              <li>Environmental conditions</li>
              <li>Early disease detection</li>
            </ul>
            <p>For example:</p>
            <ul>
              <li>Reduced grazing may indicate illness.</li>
              <li>Increased movement may suggest stress.</li>
              <li>Unusual behavior patterns could signal environmental issues.</li>
            </ul>
            <p>
              Automating this process can significantly enhance precision livestock farming.
            </p>
          </section>

          <section>
            <h2>Data Collection Using IoT Sensors</h2>
            <p>
              To capture cattle movements, we can utilize IMU sensor readings. For this model, I used data from the MPU9250 sensor, which I obtained from an existing dataset. You can access the dataset here:{' '}
              <a href="https://github.com/WASP-lab/db-cow-walking" target="_blank" rel="noopener noreferrer">
                WASP-lab db-cow-walking
              </a>.
            </p>
            <p>This dataset contains:</p>
            <ul>
              <li>Accelerometer data (AX, AY, AZ values) measuring linear motion.</li>
              <li>Gyroscope data (GX, GY, GZ values) measuring rotation.</li>
              <li>Magnetometer data (MX, MY, MZ) – although, for my model, I only used the accelerometer and gyroscope data.</li>
            </ul>
            <p>
              These signals represent how the animal moves and changes orientation over time. Below is an example of the raw sensor record:
            </p>

            <div className="blog-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>MPU9250_AX</th>
                    <th>MPU9250_AY</th>
                    <th>MPU9250_AZ</th>
                    <th>MPU9250_GX</th>
                    <th>MPU9250_GY</th>
                    <th>MPU9250_GZ</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>10:00:01</td>
                    <td>0.12</td>
                    <td>-0.05</td>
                    <td>0.98</td>
                    <td>1.3</td>
                    <td>-0.8</td>
                    <td>0.4</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2>Sliding Window Segmentation</h2>
            <p>
              In this dataset, sensor data is continuous, but machine learning models need structured samples. To address this, I divided the signal into time windows based on a research paper. The window configuration I used for my model is as follows:
            </p>
            <ul>
              <li>Window size: 5 seconds</li>
              <li>Sampling rate: 10 Hz</li>
              <li>Data points per window: 50</li>
              <li>Step size: 2.5 seconds</li>
            </ul>
            <p>
              Each window becomes one training sample. I also applied an overlapping window to capture smooth transitions between activities.
            </p>

            <figure className="blog-image-figure">
              <img src="/blog/sliding-window.svg" alt="Sliding windows over an IMU time series" loading="lazy" />
              <figcaption>Figure 2: Overlapping windows convert continuous signals into supervised samples.</figcaption>
            </figure>
          </section>

          <section>
            <h2>Feature Engineering</h2>
            <p>
              Feature engineering is the most critical step in this project. For each window, I calculated statistical features from the sensor signals. The features I used in my model include:
            </p>
            <h3>Accelerometer Features:</h3>
            <ul>
              <li>Mean acceleration</li>
              <li>Standard deviation</li>
              <li>Acceleration magnitude</li>
            </ul>
            <h3>Gyroscope Features:</h3>
            <ul>
              <li>Mean rotation</li>
              <li>Standard deviation</li>
              <li>Gyroscope magnitude</li>
            </ul>

            <p>
              I calculated the acceleration and gyroscope magnitudes using the equations below:
            </p>

            <div className="formula-box">
              <p>Acceleration Magnitude: AccMag = √(AX² + AY² + AZ²)</p>
              <p>Gyroscope Magnitude: GyroMag = √(GX² + GY² + GZ²)</p>
            </div>

            <p>
              These features summarize the overall motion energy of the animal. The final feature vector in my dataset includes the following:
            </p>
            <div className="feature-list">
              <div className="feature-col">
                <h4>Accelerometer Mean Values</h4>
                <ul>
                  <li>MPU9250_AX_mean</li>
                  <li>MPU9250_AY_mean</li>
                  <li>MPU9250_AZ_mean</li>
                  <li>AccMagnitude_mean</li>
                </ul>
              </div>
              <div className="feature-col">
                <h4>Gyroscope Mean Values</h4>
                <ul>
                  <li>MPU9250_GX_mean</li>
                  <li>MPU9250_GY_mean</li>
                  <li>MPU9250_GZ_mean</li>
                  <li>Gyro_Magnitude_mean</li>
                </ul>
              </div>
              <div className="feature-col">
                <h4>Standard Deviations</h4>
                <ul>
                  <li>MPU9250_AX_std</li>
                  <li>MPU9250_AY_std</li>
                  <li>MPU9250_AZ_std</li>
                  <li>MPU9250_GX_std</li>
                  <li>MPU9250_GY_std</li>
                  <li>MPU9250_GZ_std</li>
                  <li>Acc_Magnitude_std</li>
                  <li>Gyro_Magnitude_std</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2>Model Selection</h2>
            <p>
              For behavior classification, I experimented with multiple algorithms. After cross-validating each model, I chose Support Vector Machine (SVM) as my final model. According to the research paper, SVM was found to be the most effective model for this task.
            </p>
            <p>Reasons why SVM is effective:</p>
            <ul>
              <li>It works well with structured features.</li>
              <li>It handles high-dimensional data effectively.</li>
              <li>It performs well on medium-sized datasets.</li>
            </ul>
          </section>

          <section>
            <h2>Hyperparameter Optimization</h2>
            <p>
              To improve model performance, I performed hyperparameter tuning using Scikit-learn. The best parameters I found were C=5 and gamma=scale, which resulted in a cross-validation accuracy of 0.8651.
            </p>
          </section>

          <section>
            <h2>Model Performance</h2>
            <p>
              After training the model, I evaluated its performance on the test dataset. The classification report is as follows:
            </p>
            <div className="blog-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Class</th>
                    <th>Precision</th>
                    <th>Recall</th>
                    <th>F1-Score</th>
                    <th>Support</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Grazing</td><td>0.94</td><td>1.00</td><td>0.97</td><td>429</td></tr>
                  <tr><td>Resting</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0</td></tr>
                  <tr><td>Shaking</td><td>0.00</td><td>0.00</td><td>0.00</td><td>1</td></tr>
                  <tr><td>Standing</td><td>0.00</td><td>0.00</td><td>0.00</td><td>0</td></tr>
                  <tr><td>Walking</td><td>1.00</td><td>0.67</td><td>0.80</td><td>87</td></tr>
                  <tr><td>Accuracy</td><td>-</td><td>-</td><td>0.94</td><td>517</td></tr>
                  <tr><td>Macro Avg</td><td>0.39</td><td>0.33</td><td>0.35</td><td>517</td></tr>
                  <tr><td>Weighted Avg</td><td>0.95</td><td>0.94</td><td>0.94</td><td>517</td></tr>
                </tbody>
              </table>
            </div>
            <p>
              The overall accuracy of the model was 94%. It performed exceptionally well at detecting grazing behavior, which is the most frequent activity in the dataset. However, some behaviors had limited samples, leading to imbalance issues.
            </p>
          </section>

          <section>
            <h2>Confusion Matrix</h2>
            <p>
              Below is the confusion matrix for the model:
            </p>
            <div className="blog-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Actual \ Predicted</th>
                    <th>Grazing</th>
                    <th>Resting</th>
                    <th>Shaking</th>
                    <th>Standing</th>
                    <th>Walking</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Grazing</td><td>429</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
                  <tr><td>Resting</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
                  <tr><td>Shaking</td><td>1</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
                  <tr><td>Standing</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
                  <tr><td>Walking</td><td>26</td><td>2</td><td>0</td><td>1</td><td>58</td></tr>
                </tbody>
              </table>
            </div>
            <p>
              From the matrix, we can see that some walking samples were misclassified as grazing, which is expected due to the similar movement patterns of these activities.
            </p>
          </section>

          <section>
            <h2>Deployment Using API</h2>
            <p>
              To make the model usable in real applications, I deployed it using FastAPI. The API receives feature data and returns the predicted behavior. Here is an example request:
            </p>

            <h3>Example Request</h3>
            <pre>
{`{
  "data": [
    {
      "MPU9250_AX_mean": 0,
      "MPU9250_AY_mean": 0,
      "MPU9250_AZ_mean": 1
    }
  ]
}`}
            </pre>

            <h3>Example Response</h3>
            <pre>
{`{
  "predicted_behavior": [
    {
      "Window": 1,
      "behavior": "Walking"
    }
  ]
}`}
            </pre>

            <p>This API can be integrated with:</p>
            <ul>
              <li>IoT devices</li>
              <li>Farm dashboards</li>
              <li>Mobile livestock monitoring applications</li>
            </ul>
          </section>

          <section>
            <h2>Architecture Diagram</h2>
            <figure className="blog-image-figure">
              <img src="/blog/pipeline-architecture.svg" alt="Architecture pipeline from IoT sensor to farm dashboard" loading="lazy" />
              <figcaption>Figure 3: End-to-end pipeline from sensor signals to behavior insights.</figcaption>
            </figure>
          </section>

          <section>
            <h2>Research Inspiration</h2>
            <p>
              This project is inspired by the research paper titled{' '}
              <em>A Dataset for Detecting Walking, Grazing, and Resting Behaviors in Free-Grazing Cattle Using IoT Collar IMU Signals</em>,
              published in Frontiers in Veterinary Science. The study introduced a dataset containing IMU signals collected from cattle wearing IoT collars, which significantly guided the feature engineering and machine learning pipeline used in this project.
            </p>
          </section>

          <section>
            <h2>Future Improvements</h2>
            <p>Several enhancements could improve this system:</p>
            <ul>
              <li>Incorporation of deep learning models (LSTM / CNN)</li>
              <li>Real-time edge deployment</li>
              <li>GPS-based location tracking</li>
              <li>Larger, multi-farm datasets</li>
              <li>Behavior anomaly detection</li>
            </ul>
          </section>

          <section>
            <h2>Conclusion</h2>
            <p>
              This project demonstrates how IoT sensors and machine learning can transform traditional livestock monitoring into intelligent automated systems. By analyzing motion signals from wearable sensors, we can automatically detect cattle behaviors and provide valuable insights to farmers. As agriculture continues to adopt AI technologies, systems like this will play a crucial role in precision livestock farming.
            </p>
          </section>
        </article>
      </div>
      <Footer />
    </>
  );
}

export default CattleBehaviorBlog;
