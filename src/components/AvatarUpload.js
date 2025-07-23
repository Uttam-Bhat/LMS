import React, { useRef } from 'react';

const AvatarUpload = ({
  photoUrl,
  initials,
  onPhotoChange,
  onPhotoDelete,
  uploading,
}) => {
  const fileInputRef = useRef();

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div
        style={{
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: '#2563eb',
          color: '#fff',
          fontSize: 48,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          border: '4px solid #e0e7ef',
          position: 'relative',
        }}
      >
        {photoUrl ? (
          <img
            src={photoUrl}
            alt="Profile"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '50%',
              display: 'block',
            }}
          />
        ) : (
          initials
        )}
        {!photoUrl && (
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            style={{
              position: 'absolute',
              bottom: 8,
              right: 8,
              background: '#fff',
              color: '#2563eb',
              border: '2px solid #2563eb',
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              cursor: 'pointer',
              boxShadow: '0 2px 6px #e0e7ef',
            }}
            disabled={uploading}
            title="Add photo"
          >
            +
          </button>
        )}
        {photoUrl && (
          <button
            type="button"
            onClick={onPhotoDelete}
            style={{
              position: 'absolute',
              bottom: 8,
              right: 8,
              background: '#fff',
              color: '#e11d48',
              border: '2px solid #e11d48',
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              cursor: 'pointer',
              boxShadow: '0 2px 6px #e0e7ef',
            }}
            disabled={uploading}
            title="Remove photo"
          >
            ×
          </button>
        )}
      </div>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={onPhotoChange}
        disabled={uploading}
      />
    </div>
  );
};

export default AvatarUpload; 