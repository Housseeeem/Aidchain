const express = require('express');
const DatasetRequest = require('../models/DatasetRequest');
const Dataset = require('../models/Dataset');
const { authenticate } = require('../middleware/authMiddleware');
const hederaService = require('../services/hederaService');

const router = express.Router();

// POST /requests - Request access to a dataset (protected)
router.post('/', authenticate, async (req, res) => {
  try {
    const { datasetId } = req.body;
    const user = req.user;

    if (!datasetId) {
      return res.status(400).json({ error: 'Dataset ID is required' });
    }

    // Check if dataset exists
    const dataset = await Dataset.findById(datasetId);
    if (!dataset) {
      return res.status(404).json({ error: 'Dataset not found' });
    }

    // Check if user is the owner
    if (dataset.ownerUsername === user.email) {
      return res.status(400).json({ error: 'You already own this dataset' });
    }

    // Check if dataset is publicly accessible
    if (dataset.access) {
      return res.status(400).json({ error: 'This dataset is publicly accessible. No request needed.' });
    }

    // Check if request already exists
    const existingRequest = await DatasetRequest.findOne({
      datasetId,
      username: user.email,
    });

    if (existingRequest) {
      return res.status(409).json({
        error: 'Request already exists',
        approved: existingRequest.approved,
      });
    }

    // Create new request
    const newRequest = new DatasetRequest({
      datasetId,
      username: user.email,
      approved: false,
    });

    await newRequest.save();

    // Log to blockchain
    hederaService.logAccessRequest(
      newRequest._id.toString(),
      datasetId,
      user.email
    ).catch(err => console.error('Hedera logging failed:', err));

    res.status(201).json({
      message: 'Access request submitted successfully',
      request: {
        id: newRequest._id,
        datasetId: newRequest.datasetId,
        username: newRequest.username,
        approved: newRequest.approved,
      }
    });
  } catch (err) {
    console.error('Request access error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /requests/my - Get current user's requests (protected)
router.get('/my', authenticate, async (req, res) => {
  try {
    const requests = await DatasetRequest.find({ username: req.user.email })
      .populate('datasetId', 'datasetName description ownerUsername');
    
    res.json({ requests });
  } catch (err) {
    console.error('Get my requests error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /requests/dataset/:datasetId - Get all requests for a specific dataset (protected, owner only)
router.get('/dataset/:datasetId', authenticate, async (req, res) => {
  try {
    const { datasetId } = req.params;

    // Check if dataset exists and user is the owner
    const dataset = await Dataset.findById(datasetId);
    if (!dataset) {
      return res.status(404).json({ error: 'Dataset not found' });
    }

    if (dataset.ownerUsername !== req.user.email) {
      return res.status(403).json({ error: 'Not authorized to view requests for this dataset' });
    }

    const requests = await DatasetRequest.find({ datasetId });
    res.json({ requests });
  } catch (err) {
    console.error('Get dataset requests error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /requests/pending - Get all pending requests for datasets owned by current user (protected)
router.get('/pending', authenticate, async (req, res) => {
  try {
    // Find all datasets owned by the user
    const ownedDatasets = await Dataset.find({ ownerUsername: req.user.email });
    const datasetIds = ownedDatasets.map(d => d._id);

    // Find all pending requests for those datasets
    const pendingRequests = await DatasetRequest.find({
      datasetId: { $in: datasetIds },
      approved: false,
    }).populate('datasetId', 'datasetName description');

    res.json({ requests: pendingRequests });
  } catch (err) {
    console.error('Get pending requests error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /requests/:requestId/approve - Approve a request (protected, owner only)
router.put('/:requestId/approve', authenticate, async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await DatasetRequest.findById(requestId).populate('datasetId');
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Check if user is the dataset owner
    if (request.datasetId.ownerUsername !== req.user.email) {
      return res.status(403).json({ error: 'Not authorized to approve this request' });
    }

    // Approve the request
    request.approved = true;
    await request.save();

    // Log to blockchain
    hederaService.logAccessApproval(
      request._id.toString(),
      request.datasetId._id.toString(),
      request.username,
      req.user.email
    ).catch(err => console.error('Hedera logging failed:', err));

    res.json({
      message: 'Request approved successfully',
      request: {
        id: request._id,
        datasetId: request.datasetId._id,
        username: request.username,
        approved: request.approved,
      }
    });
  } catch (err) {
    console.error('Approve request error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /requests/:requestId - Reject/delete a request (protected, owner only)
router.delete('/:requestId', authenticate, async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await DatasetRequest.findById(requestId).populate('datasetId');
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Check if user is the dataset owner
    if (request.datasetId.ownerUsername !== req.user.email) {
      return res.status(403).json({ error: 'Not authorized to reject this request' });
    }

    await DatasetRequest.findByIdAndDelete(requestId);

    res.json({ message: 'Request rejected successfully' });
  } catch (err) {
    console.error('Reject request error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
