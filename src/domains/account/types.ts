
export type User = {
    id: string;
    name: string;
    phoneNumber: string;
    instanceId: string;
    assistantConfig: {
        id: string;
        enabled: boolean;
    };
    plan: {
        leftMessages: number;
        status: string;
        active: boolean;
        endTimestamp: number;
        name: string;
        startTimestamp: number;
        totalMessages: number;
        type: string;
        usedMessages: number;
    };
    photo: string;
}