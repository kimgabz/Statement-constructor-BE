import Joi from 'joi';
import * as HttpStatus from 'http-status-codes';
import Statement from './statement.model';
import statementService from './statement.service';
import userService from '../user/user.service';

export default {
  findAll(req, res) {
    const { page = 1, perPage = 10, filter, sortField, sortDir } = req.query;
    const options = {
      // select: '_id item',
      page: parseInt(page, 10),
      limit: parseInt(perPage, 10),
      populate: 'client',
    };

    const query = {};
    if (filter) {
      query.item = {
        $regex: filter,
      };
    }
    if (sortField && sortDir) {
      options.sort = {
        // date: 'desc',
        [sortField]: sortDir,
      };
    }
    console.log(options);
    Statement.paginate(query, options)
      .then((statements) => res.json(statements))
      .catch((error) => res.status(HttpStatus.INTERNAL_SERVER_OR).json(error));
  },
  create(req, res) {
    const schema = Joi.object().keys({
      item: Joi.string().required(),
      date: Joi.date().required(),
      due: Joi.date().required(),
      client: Joi.string().required(),
      qty: Joi.number().integer().required(),
      tax: Joi.number().optional(),
      rate: Joi.number().optional(),
    });
    const { error, value } = Joi.validate(req.body, schema);
    if (error && error.details) {
      return res.status(HttpStatus.BAD_REQUEST).json(error);
    }
    Statement.create(value)
      .then((statement) => res.json(statement))
      .catch((erroror) =>
        res.status(HttpStatus.INTERNAL_SERVER_errororOR).json(erroror)
      );
  },
  findOne(req, res) {
    const { id } = req.params;
    Statement.findById(id)
      .populate('client')
      .then((statement) => {
        if (!statement) {
          return res
            .status(HttpStatus.NOT_FOUND)
            .json({ erroror: 'Could not find any statement' });
        }
        return res.json(statement);
      })
      .catch((erroror) =>
        res.status(HttpStatus.INTERNAL_SERVER_errorOR).json(erroror)
      );
  },
  delete(req, res) {
    const { id } = req.params;
    Statement.findByIdAndRemove(id)
      .then((statement) => {
        if (!statement) {
          return res
            .status(HttpStatus.NOT_FOUND)
            .json({ erroror: 'Could not delete any statement' });
        }
        return res.json(statement);
      })
      .catch((erroror) =>
        res.status(HttpStatus.INTERNAL_SERVER_errorOR).json(erroror)
      );
  },
  update(req, res) {
    const { id } = req.params;
    const schema = Joi.object().keys({
      item: Joi.string().optional(),
      date: Joi.date().optional(),
      due: Joi.date().optional(),
      qty: Joi.number().integer().optional(),
      tax: Joi.number().optional(),
      rate: Joi.number().optional(),
      client: Joi.string().optional(),
    });
    const { error, value } = Joi.validate(req.body, schema);
    if (error && error.details) {
      return res.status(HttpStatus.BAD_REQUEST).json(error);
    }
    Statement.findOneAndUpdate({ _id: id }, value, { new: true })
      .then((statement) => res.json(statement))
      .catch((error) =>
        res.status(HttpStatus.INTERNAL_SERVER_errororOR).json(error)
      );
  },
  async download(req, res) {
    try {
      const { id } = req.params;
      const statement = await Statement.findById(id).populate('client');
      if (!statement) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .send({ error: 'could not find any invice' });
      }
      const { subTotal, total } = statementService.getTotal(statement);
      console.log(req.currentUser);
      console.log(req.user);
      const user = userService.getUser(req.user);
      const templateBody = statementService.getTemplateBody(
        statement,
        subTotal,
        total,
        user
      );
      const html = statementService.getStatementTemplate(templateBody);
      res.pdfFromHTML({
        filename: `${statement.item}.pdf`,
        htmlContent: html,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send(error);
    }
  },
};
