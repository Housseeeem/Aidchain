const {
  Client,
  PrivateKey,
  AccountId,
  FileCreateTransaction,
  FileAppendTransaction,
  TopicCreateTransaction,
  TopicMessageSubmitTransaction,
} = require('@hashgraph/sdk');

class HederaService {
  constructor() {
    this.client = null;
    this.operatorId = null;
    this.operatorKey = null;
    this.topicId = null;
  }

  /**
   * Initialize Hedera client
   */
  async initialize() {
    try {
      // Get credentials from environment
      const accountId = process.env.HEDERA_ACCOUNT_ID;
      const privateKey = process.env.HEDERA_ACCOUNT_KEY;
      const network = process.env.HEDERA_NETWORK || 'testnet';

      if (!accountId || !privateKey) {
        console.warn('Hedera credentials not configured. Blockchain features will be disabled.');
        return false;
      }

      this.operatorId = AccountId.fromString(accountId);
      this.operatorKey = PrivateKey.fromString(privateKey);

      // Create client for testnet or mainnet
      if (network === 'mainnet') {
        this.client = Client.forMainnet();
      } else {
        this.client = Client.forTestnet();
      }

      this.client.setOperator(this.operatorId, this.operatorKey);

      // Initialize or get existing topic ID
      const existingTopicId = process.env.HEDERA_TOPIC_ID;
      if (existingTopicId) {
        this.topicId = existingTopicId;
        console.log(`Using existing Hedera topic: ${this.topicId}`);
      } else {
        // Create a new topic for dataset events
        this.topicId = await this.createTopic('AidChain Dataset Events');
        console.log(`Created new Hedera topic: ${this.topicId}`);
        console.log('Add this to your .env file: HEDERA_TOPIC_ID=' + this.topicId);
      }

      console.log('Hedera service initialized successfully');
      return true;
    } catch (err) {
      console.error('Failed to initialize Hedera service:', err);
      return false;
    }
  }

  /**
   * Create a new topic on Hedera
   */
  async createTopic(memo) {
    try {
      const transaction = new TopicCreateTransaction()
        .setTopicMemo(memo)
        .setAdminKey(this.operatorKey.publicKey)
        .setSubmitKey(this.operatorKey.publicKey);

      const txResponse = await transaction.execute(this.client);
      const receipt = await txResponse.getReceipt(this.client);
      
      return receipt.topicId.toString();
    } catch (err) {
      console.error('Failed to create topic:', err);
      throw err;
    }
  }

  /**
   * Submit a message to the Hedera topic
   */
  async submitMessage(message) {
    if (!this.client || !this.topicId) {
      console.warn('Hedera not initialized. Skipping blockchain submission.');
      return null;
    }

    try {
      const messageString = typeof message === 'string' ? message : JSON.stringify(message);
      
      const transaction = new TopicMessageSubmitTransaction()
        .setTopicId(this.topicId)
        .setMessage(messageString);

      const txResponse = await transaction.execute(this.client);
      const receipt = await txResponse.getReceipt(this.client);

      return {
        status: receipt.status.toString(),
        topicId: this.topicId,
        timestamp: new Date().toISOString(),
      };
    } catch (err) {
      console.error('Failed to submit message to Hedera:', err);
      return null;
    }
  }

  /**
   * Log dataset upload event to blockchain
   */
  async logDatasetUpload(datasetId, datasetName, ownerUsername, fileHash) {
    const event = {
      type: 'DATASET_UPLOAD',
      datasetId,
      datasetName,
      ownerUsername,
      fileHash,
      timestamp: new Date().toISOString(),
    };

    return await this.submitMessage(event);
  }

  /**
   * Log dataset access request to blockchain
   */
  async logAccessRequest(requestId, datasetId, username) {
    const event = {
      type: 'ACCESS_REQUEST',
      requestId,
      datasetId,
      username,
      timestamp: new Date().toISOString(),
    };

    return await this.submitMessage(event);
  }

  /**
   * Log access approval to blockchain
   */
  async logAccessApproval(requestId, datasetId, username, approvedBy) {
    const event = {
      type: 'ACCESS_APPROVED',
      requestId,
      datasetId,
      username,
      approvedBy,
      timestamp: new Date().toISOString(),
    };

    return await this.submitMessage(event);
  }

  /**
   * Log dataset download to blockchain
   */
  async logDatasetDownload(datasetId, username) {
    const event = {
      type: 'DATASET_DOWNLOAD',
      datasetId,
      username,
      timestamp: new Date().toISOString(),
    };

    return await this.submitMessage(event);
  }

  /**
   * Upload file to Hedera File Service (for small files)
   * Note: Hedera has file size limits, so this is mainly for metadata/checksums
   */
  async uploadFileMetadata(metadata) {
    if (!this.client) {
      console.warn('Hedera not initialized. Skipping file metadata upload.');
      return null;
    }

    try {
      const metadataString = JSON.stringify(metadata);
      
      // Create file
      const transaction = new FileCreateTransaction()
        .setContents(metadataString)
        .setKeys([this.operatorKey.publicKey]);

      const txResponse = await transaction.execute(this.client);
      const receipt = await txResponse.getReceipt(this.client);
      const fileId = receipt.fileId;

      return {
        fileId: fileId.toString(),
        timestamp: new Date().toISOString(),
      };
    } catch (err) {
      console.error('Failed to upload file metadata to Hedera:', err);
      return null;
    }
  }

  /**
   * Close the Hedera client connection
   */
  close() {
    if (this.client) {
      this.client.close();
    }
  }
}

// Export a singleton instance
const hederaService = new HederaService();
module.exports = hederaService;
