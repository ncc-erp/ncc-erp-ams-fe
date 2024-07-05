import React from 'react';
import { useLocation } from 'react-router-dom';
import '../../styles/detailProductQR.less';

export const DetailProduct = () => {
  // Hardcoded data for demonstration
  const name = "Product Name";
  const firstName = "Snipe E.";
  const lastName = "Head";
  const modelName = "Ultrasharp U2415";
  const categoryName = "Displays";
  const rtdLocationName = "Bodeland";
  const notes = "Created by DB seeder Notes";
  const statusLabelName = "Ready to Deploy Status Label";

  return (
    <div className="detail-product-container">
      <div className="detail-product-content">
        <h1 className="detail-product-title">Detail Product</h1>
        <div className="detail-product-info">
          <div className="detail-info-item">
            <p className="info-title">Name:</p>
            <p className="info-content">{name}</p>
          </div>
          <div className="detail-info-item">
            <p className="info-title">First Name:</p>
            <p className="info-content">{firstName}</p>
          </div>
          <div className="detail-info-item">
            <p className="info-title">Last Name:</p>
            <p className="info-content">{lastName}</p>
          </div>
          <div className="detail-info-item">
            <p className="info-title">Model Name:</p>
            <p className="info-content">{modelName}</p>
          </div>
          <div className="detail-info-item">
            <p className="info-title">Category Name:</p>
            <p className="info-content">{categoryName}</p>
          </div>
          <div className="detail-info-item">
            <p className="info-title">RTD Location Name:</p>
            <p className="info-content">{rtdLocationName}</p>
          </div>
          <div className="detail-info-item">
            <p className="info-title">Notes:</p>
            <p className="info-content">{notes}</p>
          </div>
          <div className="detail-info-item">
            <p className="info-title">Status Label Name:</p>
            <p className="info-content">{statusLabelName}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
