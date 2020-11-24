const getNextStep = (currentStep: string) => {
    switch (currentStep) {
        case 'email':
            return {
                type: 'completed'
            }
    }
}

export default {
    getNextStep
}