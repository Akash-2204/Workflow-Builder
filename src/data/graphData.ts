import { GraphData } from '../types/Graph';

export const graphData: GraphData = {
    "nodes": [
        { "id": "1", "label": "Alice", "type": "Person" },
        { "id": "2", "label": "Bob", "type": "Person" },
        { "id": "3", "label": "Charlie", "type": "Person" },
        { "id": "4", "label": "Daisy", "type": "Person" },
        { "id": "5", "label": "Eve", "type": "Person" },

        { "id": "6", "label": "TechCorp", "type": "Company" },
        { "id": "7", "label": "InnoSoft", "type": "Company" },
        { "id": "8", "label": "DevLabs", "type": "Company" },
        { "id": "25", "label": "Startup Y", "type": "Company" },

        { "id": "9", "label": "React.js", "type": "Technology" },
        { "id": "10", "label": "Node.js", "type": "Technology" },
        { "id": "11", "label": "Python", "type": "Technology" },
        { "id": "12", "label": "AWS", "type": "Technology" },
        { "id": "13", "label": "Sigma.js", "type": "Technology" },
        { "id": "14", "label": "React Flow", "type": "Technology" },

        { "id": "15", "label": "Project Alpha", "type": "Project" },
        { "id": "16", "label": "Project Beta", "type": "Project" },
        { "id": "26", "label": "Project Gamma", "type": "Project" },

        { "id": "17", "label": "Data Science Club", "type": "Community" },
        { "id": "18", "label": "Open Source Group", "type": "Community" },
        { "id": "23", "label": "AI Research Group", "type": "Community" },
        { "id": "24", "label": "Machine Learning Forum", "type": "Community" },

        { "id": "19", "label": "Conference A", "type": "Event" },
        { "id": "20", "label": "Hackathon X", "type": "Event" },

        { "id": "21", "label": "Investor A", "type": "Investor" },
        { "id": "22", "label": "Investor B", "type": "Investor" }
    ],

    "edges": [
        { "source": "1", "target": "6", "relationship": "Works At" },
        { "source": "2", "target": "6", "relationship": "Works At" },
        { "source": "3", "target": "7", "relationship": "Works At" },
        { "source": "4", "target": "8", "relationship": "Works At" },
        { "source": "5", "target": "25", "relationship": "Works At" },

        { "source": "6", "target": "9", "relationship": "Uses" },
        { "source": "6", "target": "12", "relationship": "Uses" },
        { "source": "7", "target": "10", "relationship": "Uses" },
        { "source": "8", "target": "11", "relationship": "Uses" },
        { "source": "25", "target": "9", "relationship": "Uses" },
        { "source": "25", "target": "14", "relationship": "Uses" },

        { "source": "21", "target": "6", "relationship": "Funds" },
        { "source": "21", "target": "7", "relationship": "Funds" },
        { "source": "22", "target": "8", "relationship": "Funds" },
        { "source": "22", "target": "25", "relationship": "Funds" },

        { "source": "1", "target": "15", "relationship": "Contributes To" },
        { "source": "1", "target": "16", "relationship": "Contributes To" },
        { "source": "2", "target": "15", "relationship": "Contributes To" },
        { "source": "3", "target": "26", "relationship": "Contributes To" },

        { "source": "15", "target": "9", "relationship": "Uses" },
        { "source": "15", "target": "10", "relationship": "Uses" },
        { "source": "16", "target": "12", "relationship": "Uses" },
        { "source": "26", "target": "11", "relationship": "Uses" },

        { "source": "1", "target": "17", "relationship": "Member Of" },
        { "source": "2", "target": "18", "relationship": "Member Of" },
        { "source": "3", "target": "23", "relationship": "Member Of" },
        { "source": "4", "target": "24", "relationship": "Member Of" },
        { "source": "5", "target": "23", "relationship": "Member Of" },

        { "source": "6", "target": "25", "relationship": "Partnership With" },
        { "source": "7", "target": "8", "relationship": "Partnership With" },

        { "source": "5", "target": "19", "relationship": "Attended" },
        { "source": "1", "target": "20", "relationship": "Attended" },

        { "source": "9", "target": "14", "relationship": "Compatible With" },
        { "source": "13", "target": "14", "relationship": "Compatible With" }
    ]
}; 