const getNextStep = (currentStep: string) => {
    switch (currentStep) {
        case 'email':
            return {
                type: 'completed',
                trackingUrl: 'https://google.es'
            }
    }
}

export default {
    getNextStep
}