import mongoose from 'mongoose';

export interface SystemTestsType{ 
  problemId: string,
  tested: boolean,
  tests: {
    input: string,
    output: string,
  }[],
  createdAt: Date,
  author: string,
  userId: string,
  linesPerTestcase: number,
}

const systemTestsSchema = new mongoose.Schema({
  linesPerTestcase: {
    type: Number,
    default: 1,
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
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  author: {
    type: String,
    required: true,
  },
})

const SystemTests = mongoose.model('systests', systemTestsSchema);
export default SystemTests;
