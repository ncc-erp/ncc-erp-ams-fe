import React from 'react';
import { useLocation } from 'react-router-dom';
import '../../styles/detailProductQR.less';

export const DetailProduct = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const id = queryParams.get('id');
    const name = queryParams.get('name');
    const first_name = queryParams.get('first_name');
    const last_name = queryParams.get('last_name');
    const model_name = queryParams.get('model_name');
    const category_name = queryParams.get('category_name');
    const rtd_location_name = queryParams.get('rtd_location_name');
    const notes = queryParams.get('notes');
    const status_label_name = queryParams.get('status_label_name');

    return (
        <div className="detail-product-container">
            <div className="detail-product-content">
                <h1 className="detail-product-title">Detail Device</h1>
                <div className="detail-product-info">
                    <div className="detail-info-item">
                        <p className="info-title">ID:</p>
                        <p className="info-content">{id ? id : 'n/a'}</p>
                    </div>
                    <div className="detail-info-item">
                        <p className="info-title">Name:</p>
                        <p className="info-content">{name? name : 'n/a'}</p>
                    </div>
                    <div className="detail-info-item">
                        <p className="info-title">First Name:</p>
                        <p className="info-content">{first_name? first_name : 'n/a'}</p>
                    </div>
                    <div className="detail-info-item">
                        <p className="info-title">Last Name:</p>
                        <p className="info-content">{last_name ? last_name : 'n/a'}</p>
                    </div>
                    <div className="detail-info-item">
                        <p className="info-title">Model Name:</p>
                        <p className="info-content">{model_name ? model_name : 'n/a'}</p>
                    </div>
                    <div className="detail-info-item">
                        <p className="info-title">Category Name:</p>
                        <p className="info-content">{category_name ? category_name : 'n/a'}</p>
                    </div>
                    <div className="detail-info-item">
                        <p className="info-title">RTD Location Name:</p>
                        <p className="info-content">{rtd_location_name ? rtd_location_name : 'n/a'}</p>
                    </div>
                    <div className="detail-info-item">
                        <p className="info-title">Notes:</p>
                        <p className="info-content">{notes ? notes : 'n/a'}</p>
                    </div>
                    <div className="detail-info-item">
                        <p className="info-title">Status Label Name:</p>
                        <p className="info-content">{status_label_name ? status_label_name : 'n/a'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
