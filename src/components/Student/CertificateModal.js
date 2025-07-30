import React from 'react';
import { FaDownload, FaTimes, FaGraduationCap, FaAward, FaCalendarAlt, FaUserGraduate } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const CertificateModal = ({ isOpen, onClose, courseName, studentName, completionDate }) => {
  if (!isOpen) return null;

  const handleDownload = async () => {
    const certificateElement = document.getElementById('certificate');
    if (!certificateElement) return;

    try {
      const canvas = await html2canvas(certificateElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`Certificate_${courseName.replace(/\s+/g, '_')}_${studentName.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.8)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        maxWidth: '90vw',
        maxHeight: '90vh',
        overflow: 'auto',
        position: 'relative',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 30px',
          borderBottom: '1px solid #e5e7eb',
          background: '#f8fafc'
        }}>
          <h2 style={{ margin: 0, color: '#1f2937', fontSize: '1.5rem', fontWeight: 600 }}>
            Course Completion Certificate
          </h2>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleDownload}
              style={{
                background: '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 16px',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'background 0.2s'
              }}
              onMouseOver={(e) => e.target.style.background = '#1d4ed8'}
              onMouseOut={(e) => e.target.style.background = '#2563eb'}
            >
              <FaDownload size={14} />
              Download PDF
            </button>
            <button
              onClick={onClose}
              style={{
                background: '#ef4444',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 16px',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'background 0.2s'
              }}
              onMouseOver={(e) => e.target.style.background = '#dc2626'}
              onMouseOut={(e) => e.target.style.background = '#ef4444'}
            >
              <FaTimes size={14} />
              Close
            </button>
          </div>
        </div>

        {/* Certificate */}
        <div style={{ padding: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '600px' }}>
          <div
            id="certificate"
            style={{
              width: '800px',
              height: '600px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
              borderRadius: '20px',
              padding: '40px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            {/* Background Pattern */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
              opacity: 0.3
            }} />

            {/* Border */}
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              right: '20px',
              bottom: '20px',
              border: '3px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '15px'
            }} />

            {/* Content */}
            <div style={{
              position: 'relative',
              zIndex: 1,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              textAlign: 'center',
              color: '#fff',
              padding: '20px 0',
              boxSizing: 'border-box'
            }}>
              {/* Header */}
              <div style={{ marginBottom: '20px' }}>
                <FaGraduationCap size={60} style={{ marginBottom: '20px', opacity: 0.9 }} />
                <h1 style={{
                  fontSize: '2.5rem',
                  fontWeight: 700,
                  margin: '0 0 10px 0',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                }}>
                  CERTIFICATE OF COMPLETION
                </h1>
                <p style={{
                  fontSize: '1.1rem',
                  margin: 0,
                  opacity: 0.9,
                  fontWeight: 400
                }}>
                  This is to certify that
                </p>
              </div>

              {/* Student Name */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.15)',
                padding: '20px 40px',
                borderRadius: '15px',
                margin: '20px 0',
                border: '2px solid rgba(255, 255, 255, 0.2)'
              }}>
                <h2 style={{
                  fontSize: '2.2rem',
                  fontWeight: 600,
                  margin: 0,
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                }}>
                  {studentName}
                </h2>
              </div>

              {/* Course Details */}
              <div style={{ marginBottom: '20px' }}>
                <p style={{
                  fontSize: '1.2rem',
                  margin: '0 0 15px 0',
                  opacity: 0.9
                }}>
                  has successfully completed the course
                </p>
                <h3 style={{
                  fontSize: '1.8rem',
                  fontWeight: 600,
                  margin: '0 0 20px 0',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '15px 30px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  {courseName}
                </h3>
              </div>

              {/* Completion Date */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '20px',
                fontSize: '1.1rem',
                opacity: 0.9
              }}>
                <FaCalendarAlt size={16} />
                <span>Completed on {formatDate(completionDate)}</span>
              </div>

              {/* Provider Info */}
              <div style={{
                paddingTop: '20px',
                borderTop: '2px solid rgba(255, 255, 255, 0.2)',
                width: '100%',
                marginTop: 'auto',
                position: 'relative',
                zIndex: 3
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  fontSize: '0.9rem',
                  opacity: 0.8,
                  gap: '20px',
                  paddingLeft: '60px',
                  paddingRight: '60px'
                }}>
                  <div style={{ textAlign: 'left', flex: 1 }}>
                    <div style={{ fontWeight: 600, marginBottom: '5px' }}>LAMS Learning Management System</div>
                    <div>Certificate Provider</div>
                  </div>
                  <div style={{ textAlign: 'right', flex: 1 }}>
                    <div style={{ fontWeight: 600, marginBottom: '5px' }}>Certificate ID</div>
                    <div>{`LAMS-${Date.now().toString().slice(-8)}`}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div style={{
              position: 'absolute',
              top: '30px',
              right: '30px',
              opacity: 0.1,
              zIndex: 2
            }}>
              <FaAward size={40} />
            </div>
            <div style={{
              position: 'absolute',
              bottom: '30px',
              left: '30px',
              opacity: 0.1,
              zIndex: 1
            }}>
              <FaUserGraduate size={40} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateModal; 