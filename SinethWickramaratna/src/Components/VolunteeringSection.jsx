import './VolunteeringSection.css';
import { useInView } from '../hooks/useInView';
import VolunteeringCard from './VolunteeringComponents/VolunteeringCard';
import { useState, useMemo } from 'react';
import volunteeringDataRaw from '../data/volunteeringData.json';

function VolunteeringSection() {
  const [volunteeringRef, isVolunteeringInView] = useInView();
  const [showAll, setShowAll] = useState(false);
  const INITIAL_DISPLAY_COUNT = 3;

  const volunteeringData = volunteeringDataRaw;

  // Function to convert month abbreviation to number
  const getMonthNumber = (month) => {
    const months = {
      'JAN': 1, 'Jan': 1,
      'FEB': 2, 'Feb': 2,
      'MAR': 3, 'Mar': 3,
      'APR': 4, 'Apr': 4,
      'MAY': 5, 'May': 5,
      'JUN': 6, 'Jun': 6,
      'JUL': 7, 'Jul': 7,
      'AUG': 8, 'Aug': 8,
      'SEP': 9, 'Sep': 9,
      'OCT': 10, 'Oct': 10,
      'NOV': 11, 'Nov': 11,
      'DEC': 12, 'Dec': 12
    };
    return months[month] || 0;
  };

  // Function to get a comparable date value
  const getDateValue = (dateObj) => {
    if (dateObj.year === 'Present') {
      return 999999; // Present is always the latest
    }
    const year = typeof dateObj.year === 'number' ? dateObj.year : parseInt(dateObj.year) || 0;
    const month = dateObj.month ? getMonthNumber(dateObj.month) : 0;
    return year * 100 + month;
  };

  // Sort volunteering data by start date (latest first)
  const sortedVolunteeringData = useMemo(() => {
    return [...volunteeringData].sort((a, b) => {
      const dateA = getDateValue(a.startDate);
      const dateB = getDateValue(b.startDate);
      return dateB - dateA; // Descending order (latest first)
    });
  }, []);

  // Determine which items to display
  const displayedData = showAll ? sortedVolunteeringData : sortedVolunteeringData.slice(0, INITIAL_DISPLAY_COUNT);
  const hasMore = sortedVolunteeringData.length > INITIAL_DISPLAY_COUNT;

  return (
    <section className="volunteering-section" id="volunteering" ref={volunteeringRef}>
      <div className="volunteering-container">
        <div className={`volunteering-header ${isVolunteeringInView ? 'loaded' : ''}`}>
          <h2 className="volunteering-title">Volunteering & Leadership</h2>
          <div className="volunteering-accent"></div>
        </div>

        <div className={`volunteering-content ${isVolunteeringInView ? 'loaded' : ''}`}>
          <div className="volunteering-list">
            {displayedData.map((item, index) => (
              <VolunteeringCard key={item.id} item={item} index={index} />
            ))}
          </div>

          {hasMore && !showAll && (
            <div className="load-more-container">
              <button 
                className="load-more-btn" 
                onClick={() => setShowAll(true)}
              >
                <span className="btn-text">Load More Experiences</span>
                <span className="btn-icon">▼</span>
              </button>
            </div>
          )}

          {showAll && hasMore && (
            <div className="load-more-container">
              <button 
                className="load-more-btn show-less" 
                onClick={() => setShowAll(false)}
              >
                <span className="btn-text">Show Less</span>
                <span className="btn-icon">▲</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default VolunteeringSection;
