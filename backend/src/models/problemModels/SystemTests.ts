import mongoose from 'mongoose';

export interface SystemTestsType {
  problemId: string,
  tested?: boolean,
  tests: {
    input: string,
    output: string,
  }[],
  createdAt: Date,
  author: string,
  userId: string,
  testLines: number,
}

const systemTestsSchema = new mongoose.Schema({
  testLines: {
    type: Number,
    required: true,
  },
  problemId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  tested: {
    type: Boolean,
    default: false,
  },
  runtime_s: {
    type: Number,
    required: true,
  },
  tests: {
    type: [{
      input: {
        type: String,
        required: true
      },
      output: {
        type: String,
        required: true
      }
    }],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  author: {
    type: String,
    required: true,
  },
}, { strict: true })

const SystemTests = mongoose.model('systemTests', systemTestsSchema);
export default SystemTests;

