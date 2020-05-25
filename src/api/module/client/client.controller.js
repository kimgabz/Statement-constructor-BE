import {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
} from 'http-status-codes';
import clientService from './client.service';
import Client from './client.model';

export default {
  async create(req, res) {
    try {
      const { value, error } = clientService.validateCreateSchema(req.body);
      if (error && error.details) {
        return res.status(BAD_REQUEST).json(error);
      }
      const client = await Client.create(value);
      return res.json(client);
    } catch (error) {
      return res.status(INTERNAL_SERVER_ERROR).json(error);
    }
  },
  async findAll(req, res) {
    try {
      const client = await Client.find();
      return res.json(client);
    } catch (error) {
      return res.status(INTERNAL_SERVER_ERROR).json(error);
    }
  },
  async findOne(req, res) {
    try {
      const client = await Client.findById(req.params.id);
      if (!client) {
        return res.status(NOT_FOUND).json({ error: 'client not found' });
      }
      return res.json(client);
    } catch (error) {
      return res.status(INTERNAL_SERVER_ERROR).json(error);
    }
  },
  async delete(req, res) {
    const client = await Client.findOneAndRemove({ _id: req.params.id });
    if (!client) {
      return res.status(NOT_FOUND).json({ error: 'could not delete client' });
    }
    return res.json(client);
  },
  async update(req, res) {
    try {
      const { value, error } = clientService.validateUpdateSchema(req.body);
      if (error && error.details) {
        return res.status(BAD_REQUEST).json(error);
      }
      const client = await Client.findOneAndUpdate(
        { _id: req.params.id },
        value,
        { new: true }
      );
      return res.json(client);
    } catch (error) {
      return res.status(INTERNAL_SERVER_ERROR).json(error);
    }
  },
};
