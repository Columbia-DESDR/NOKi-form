import React, { useEffect, useState } from 'react';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';

const functionNames = [
    'get_current_date', 'get_from_response', 'ccp_prediction_text'
];

const initialFormData = {
    surveyName: 'CCP harvest season followup',
    instanceName: 'Colombia coffee planters',
    comments: 'Colombia coffee planters harvest followup',
    startMsg: 'harvest survey',
    restartMsg: 'restart',
    survey: {
        start: {
            type: 'var',
            msgs: ['Start of the survey. Hi %%name%% %%surname%%'],
            params: {
                name: {
                    function_name: 'startFunction',
                    args: ['arg1', 'arg2']
                },
                surname: {
                    function_name: 'startFunction',
                    args: ['arg1', 'arg2']
                },
            },
            next: 'end'
        },
        end: {
            type: 'var',
            msgs: ['End of the survey'],
            next: ''
        }
    }
};

const uiSchema = {
    "ui:globalOptions": {
        enableMarkdownInDescription: true,
        orderable: false,
    }
};

const baseSchema = {
    title: 'NOKi Form',
    type: 'object',
    required: ['surveyName', 'instanceName', 'comments', 'startMsg', 'restartMsg'],
    properties: {
        instanceName: { type: 'string', title: 'Instance Name', description: 'Enter the specific name for this instance.' },
        surveyName: { type: 'string', title: 'Survey Name', description: 'Provide the name of the survey.' },
        comments: { type: 'string', title: 'Comments', description: 'Add any additional comments or notes.' },
        startMsg: { type: 'string', title: 'Start Message', description: 'This message will initiate this survey process.' },
        restartMsg: { type: 'string', title: 'Restart Message', description: 'This message will restart this survey process.' },
        survey: {
            type: 'object',
            title: 'Survey Questions',
            description: "Configure the survey questions with various types and messages.",
            additionalProperties: {
                type: 'object',
                properties: {
                    type: {
                        type: 'string',
                        title: 'Question Type',
                        description: 'Choose the type of question you want to ask.',
                        enum: ['var', 'text', 'mcq'],
                    },
                    next: {
                        type: 'string',
                        title: 'Next Question',
                        enum: [''] // To be updated dynamically
                    }
                },
                allOf: [
                    {
                        if: {
                            properties: { type: { const: "var" } }
                        },
                        then: {
                            properties: {
                                msgs: {
                                    type: 'array',
                                    title: 'Message',
                                    items: { type: 'string' }
                                },
                                params: {
                                    type: 'object',
                                    title: 'Message Variable',
                                    additionalProperties: {
                                        type: 'object',
                                        properties: {
                                            function_name: {
                                                type: 'string',
                                                enum: functionNames
                                            },
                                            args: {
                                                type: 'array',
                                                items: { type: 'string' }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    {
                        if: {
                            properties: { type: { const: "text" } }
                        },
                        then: {
                            properties: {
                                msgs: {
                                    type: 'array',
                                    title: 'Message',
                                    items: { type: 'string' }
                                }
                            }
                        }
                    },
                    {
                        if: {
                            properties: { type: { const: "mcq" } }
                        },
                        then: {
                            properties: {
                                msgs: {
                                    type: 'array',
                                    title: 'Message',
                                    items: { type: 'string' }
                                },
                                params: {
                                    type: 'object',
                                    title: 'Message Variable',
                                    additionalProperties: {
                                        type: 'object',
                                        properties: {
                                            function_name: {
                                                type: 'string',
                                                enum: functionNames
                                            },
                                            args: {
                                                type: 'array',
                                                items: { type: 'string' }
                                            }
                                        }
                                    }
                                },
                                options: {
                                    type: "object",
                                    title: 'MCQ Options',
                                    additionalProperties: {
                                        type: "string"
                                    }
                                }
                            }
                        }
                    }
                ]
            }
        }
    }
};

const App = () => {
    const [formData, setFormData] = useState(initialFormData);
    const [submittedData, setSubmittedData] = useState(null);
    const [dynamicSchema, setDynamicSchema] = useState(baseSchema);

    const handleSubmit = ({ formData }) => {
        console.log('submitted', formData);
        setSubmittedData(formData)
    };

    const extractKeysFromSurvey = (survey) => {
        return Object.keys(survey);
    };

    const generateDynamicSchema = () => {
        const surveyKeys = extractKeysFromSurvey(formData.survey);
        
        // Ensure enum properties are non-empty arrays or handle empty cases
        const nextEnum = surveyKeys.length ? surveyKeys : ['']; // Default empty value to prevent schema errors

        return {
            ...baseSchema,
            properties: {
                ...baseSchema.properties,
                survey: {
                    ...baseSchema.properties.survey,
                    additionalProperties: {
                        ...baseSchema.properties.survey.additionalProperties,
                        properties: {
                            ...baseSchema.properties.survey.additionalProperties.properties,
                            next: {
                                type: 'string',
                                title: 'Next Question',
                                enum: nextEnum
                            }
                        }
                    }
                }
            }
        };
    };

    useEffect(() => {
        setDynamicSchema(generateDynamicSchema());
    }, [formData]);

    const handleChange = ({ formData }) => {
        setFormData(formData);
    };

    return (
        <>
            <Form
                schema={dynamicSchema}
                formData={formData}
                validator={validator}
                onChange={handleChange}
                onSubmit={handleSubmit}
                onError={console.log.bind(console, 'errors')}
                uiSchema={uiSchema}
            />
            {submittedData && (
                <div>
                    <h3>Submitted Data:</h3>
                    <pre>{JSON.stringify(submittedData, null, 2)}</pre>
                </div>
            )}
        </>
    );
}

export default App;
