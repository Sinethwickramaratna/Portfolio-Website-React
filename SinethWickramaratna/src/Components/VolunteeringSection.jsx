import './VolunteeringSection.css';
import { useInView } from '../hooks/useInView';
import VolunteeringCard from './VolunteeringComponents/VolunteeringCard';
import { useState, useMemo } from 'react';

function VolunteeringSection() {
  const [volunteeringRef, isVolunteeringInView] = useInView();
  const [showAll, setShowAll] = useState(false);
  const INITIAL_DISPLAY_COUNT = 3;

  const volunteeringData = [
    {
      id: 1,
      organization: 'Rotaract Club of University of Moratuwa',
      position: 'Public Relations Avenue Director',
      startDate: { year: 2025, month: 'Jul' },
      endDate: { year: 'Present', month: '' },
      icon: '🤝',
      description: 'Oversee strategic communications, branding, and outreach activities'
    },
    {
      id: 2,
      organization: 'Rotaract Club of University of Moratuwa',
      position: 'Assistant Treasurer',
      startDate: { year: 2024, month: 'Jul' },
      endDate: { year: 2025, month: 'Jun' },
      icon: '💼',
      description: 'Organized and coordinated community service initiatives'
    },
    {
      id: 3,
      organization: 'IEEE RAS Student Branch Chapter of University of Moratuwa',
      position: 'Design Committee Member',
      startDate: { year: 2025, month: 'JAN' },
      endDate: { year: 2025, month: 'Dec' },
      icon: '📚',
      description: 'Teaching programming and digital literacy to underprivileged students'
    },
    {
      id: 4,
      organization: 'IEEE RAS Student Branch Chapter of University of Moratuwa',
      position: 'Design Committee Lead of Bot Talk 3.0',
      startDate: { year: 2025, month: 'Oct' },
      endDate: { year: 2025, month: 'Nov' },
      icon: '🤖',
      description:'Led design and development of robotics projects for Bot Talk 3.0'
    },
    {
      id: 5,
      organization: 'IEEE Student Branch Chapter of University of Moratuwa',
      position: 'Design Committee Member of Moraforesight 3.0',
      startDate: { year: 2025, month: 'Feb' },
      endDate: { year: 2025, month: 'Aug' },
      icon: '🔬',
      description: 'Contributed to design and development of projects for Moraforesight 3.0'
    },
    {
      id: 6,
      organization: 'Mathematics Society of University of Moratuwa',
      position: 'Design Committee Member',
      startDate: { year: 2024, month: 'Apr' },
      endDate: { year: 2025, month: 'Jan' },
      icon: '📐',
      description: 'Participated in designing and organizing events for the Mathematics Society'
    },
    {
      id: 7,
      organization: 'Rotaract Club of University of Moratuwa',
      position: 'Co-Chairperson of Binara Padhura',
      startDate: { year: 2024, month: 'Jul' },
      endDate: { year: 2024, month: 'Sep' },
      icon: '📖',
      description: 'Coordinated and led the Binara Padhura event for the Rotaract Club'
    },
    {
      id: 8,
      organization: 'Rotaract Club of University of Moratuwa',
      position: 'Event Organizer of Nadhya Musical Concert',
      startDate: { year: 2024, month: 'Mar' },
      endDate: { year: 2024, month: 'Jun' },
      icon: '🎶',
      description: 'Organized the Nadhya Musical Concert for the Rotaract Club'
    },
    {
      id: 9,
      organization: 'Rotaract Club of University of Moratuwa',
      position: 'Organizing Committee Member of Kowul Wasanthaya',
      startDate: { year: 2024, month: 'Mar' },
      endDate: { year: 2024, month: 'Apr' },
      icon: '🌸',
      description: 'Contributed to organizing the Kowul Wasanthaya event for the Rotaract Club'
    },
    {
      id: 10,
      organization: 'Rotaract Club of University of Moratuwa',
      position: 'Co-Chairperson of Hand in Hand',
      startDate: { year: 2024, month: 'Sep' },
      endDate: { year: 2025, month: 'May' },
      icon: '🤲',
      description: 'Coordinated and led the Hand in Hand event for the Rotaract Club'
    },
    {
      id: 11,
      organization: 'Rotaract Club of University of Moratuwa',
      position: 'Co-Chairperson of 30th Installation Ceremony',
      startDate: { year: 2025, month: 'Sep' },
      endDate: { year: 2025, month: 'Oct' },
      icon: '🎉',
      description: 'Coordinated and led the 30th Installation Ceremony for the Rotaract Club'
    },
    {
      id: 12,
      organization: 'Computer Science & Engineering Department of University of Moratuwa',
      position: 'Design Committee Co-lead of SLIoT Challenge 2026',
      startDate: { year: 2025, month: 'Nov' },
      endDate: { year: 'Present', month: '' },
      icon: '💻',
      description: 'Leading design and development of projects for the SLIoT Challenge 2026'
    }

  ];

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
