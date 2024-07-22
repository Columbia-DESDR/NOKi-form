import React, { useState } from 'react';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';

const schema = {
    title: 'NOKi Form',
    type: 'object',
    required: ['surveyName', 'instanceName', 'comments', 'startMsg', 'restartMsg'],
    properties: {
        surveyName: { 
            type: 'string', 
            title: 'Survey Name', 
            default: '' 
        },
        instanceName: { 
            type: 'string', 
            title: 'Instance Name', 
        },
        comments: { 
            type: 'string', 
            title: 'Comments', 
            default: 'Type some comment here...' 
        },
        startMsg: { 
            type: 'string', 
            title: 'Start Message', 
            default: '' 
        },
        restartMsg: { 
            type: 'string', 
            title: 'Restart Message', 
            default: '' 
        },
        survey: {
            type: 'object', 
            title: 'Survey',
            properties: {
                start: {
                    type: 'object',
                    title: 'Start',
                    required: ["type", "msgs", "next"],
                    properties: {
                        type: {
                            type: 'string',
                            title: 'Data Type',
                            default: 'var'
                        },
                        msgs: {
                            type: 'array',
                            title: 'Messages',
                            items: { type: 'string' }
                        },
                        params: {
                            type: 'object',
                            title: 'Parameters',
                            properties: {
                                varName: {
                                    type: 'string',
                                    title: 'Variable Name for message'
                                },
                                funcName: {
                                    type: 'string',
                                    title: 'Function Name'
                                },
                                args: {
                                    type: 'array',
                                    title: 'Function Arguments',
                                    items: { type: 'string' }
                                }
                            }
                        },
                        next: {
                            type: 'string',
                            title: 'Next Block'
                        }
                    }
                },
                end: {
                    type: 'object',
                    title: 'End',
                    required: ["type", "msgs", "next"],
                    properties: {
                        type: {
                            type: 'string',
                            title: 'Data Type',
                            default: 'var'
                        },
                        msgs: {
                            type: 'array',
                            title: 'Messages',
                            items: { type: 'string' }
                        },
                        params: {
                            type: 'object',
                            title: 'Parameters',
                            properties: {
                                varName: {
                                    type: 'string',
                                    title: 'Variable Name for message'
                                },
                                funcName: {
                                    type: 'string',
                                    title: 'Function Name'
                                },
                                args: {
                                    type: 'array',
                                    title: 'Function Arguments',
                                    items: { type: 'string' }
                                }
                            }
                        },
                        next: {
                            type: 'string',
                            title: 'Next Block'
                        }
                    }
                }
            },
            additionalProperties: {
                type: 'object',
                required: ["type", "msgs", "next"],
                properties: {
                    type: {
                        type: 'string',
                        title: 'Data Type',
                        default: 'var'
                    },
                    msgs: {
                        type: 'array',
                        title: 'Messages',
                        items: { type: 'string' }
                    },
                    params: {
                        type: 'object',
                        title: 'Parameters',
                        properties: {
                            varName: {
                                type: 'string',
                                title: 'Variable Name for message'
                            },
                            funcName: {
                                type: 'string',
                                title: 'Function Name'
                            },
                            args: {
                                type: 'array',
                                title: 'Function Arguments',
                                items: { type: 'string' }
                            }
                        }
                    },
                    next: {
                        type: 'string',
                        title: 'Next Block'
                    }
                }
            }
        }
    },
};

const formData = {
    surveyName: 'CCP harvest season followup',
    instanceName: 'Colombia coffee planters',
    comments: 'Colombia coffee planters harvest followup',
    startMsg: 'harvest survey',
    restartMsg: 'restart',
    survey: {
        start: {
            type: 'var',
            msgs: ['Start of the survey'],
            params: {
                varName: 'startVar',
                funcName: 'startFunction',
                args: ['arg1', 'arg2']
            },
            next: 'nextBlock'
        },
        end: {
            type: 'var',
            msgs: ['End of the survey'],
            params: {
                varName: 'endVar',
                funcName: 'endFunction',
                args: ['arg1', 'arg2']
            },
            next: 'nextBlock'
        }
        // Add user-defined sections here
    }
}

const App = () => {
    const [submittedData, setSubmittedData] = useState(null);

    const handleSubmit = ({ formData }) => {
        setSubmittedData(formData);
        console.log('submitted', formData);
    };

    return(
        <>
            <Form
                schema={schema}
                formData={formData}
                validator={validator}
                onChange={console.log.bind(console, 'changed')}
                onSubmit={handleSubmit}
                onError={console.log.bind(console, 'errors')}
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
