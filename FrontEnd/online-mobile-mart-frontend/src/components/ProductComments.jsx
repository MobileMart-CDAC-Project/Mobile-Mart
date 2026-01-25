import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

const ProductComments = ({ productId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchComments();
  }, [productId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/products/${productId}/comments`);
      setComments(response.data);
    } catch (err) {
      setError('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      await axiosInstance.post(`/products/${productId}/comments`, {
        comment: newComment.trim()
      });

      setNewComment('');
      fetchComments(); // Refresh comments
    } catch (err) {
      setError('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="product-comments mt-4">
      <h4 className="mb-3">Customer Reviews</h4>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Add Comment Form */}
      <div className="mb-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="comment" className="form-label">Add a Review</label>
            <textarea
              className="form-control"
              id="comment"
              rows="3"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts about this product..."
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting || !newComment.trim()}
          >
            {submitting ? 'Posting...' : 'Post Review'}
          </button>
        </form>
      </div>

      {/* Comments List */}
      <div className="comments-list">
        {loading ? (
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : comments.length === 0 ? (
          <p className="text-muted">No reviews yet. Be the first to review this product!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.commentId} className="card mb-3">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h6 className="card-title mb-0">{comment.userName}</h6>
                  <small className="text-muted">{formatDate(comment.createdAt)}</small>
                </div>
                <p className="card-text">{comment.comment}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductComments;