import { envConfig } from '@/constants/environment';
import { createTuitionRepository, type ITuitionRepository } from './tuition.api';
import { learningRepository, type LearningRepository } from './learning.api';
import { adminRepository, type AdminRepository } from './admin.api';
import { studentRepository, type StudentRepository } from './student.api';
import { workflowRepository, type WorkflowRepository } from './workflow.api';

export const tuitionRepository: ITuitionRepository = createTuitionRepository(envConfig.useMockData);
export { learningRepository };
export { adminRepository };
export { studentRepository };
export { workflowRepository };

export type { ITuitionRepository };
export type { LearningRepository };
export type { AdminRepository };
export type { StudentRepository };
export type { WorkflowRepository };
export { MockTuitionRepository, ApiTuitionRepository } from './tuition.api';
