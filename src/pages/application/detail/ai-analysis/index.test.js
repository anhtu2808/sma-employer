import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import AiAnalysis from './index';

jest.mock('../score-card', () => () => <div data-testid="score-card">ScoreCard</div>);

jest.mock('recharts', () => {
    const Wrapper = ({ children }) => <div>{children}</div>;

    return {
        ResponsiveContainer: Wrapper,
        RadarChart: Wrapper,
        PolarGrid: () => null,
        PolarAngleAxis: () => null,
        PolarRadiusAxis: () => null,
        Radar: () => null,
        Tooltip: () => null,
    };
});

const buildEvaluation = (criteriaScores) => ({
    aiOverallScore: 86,
    matchLevel: 'GOOD_MATCH',
    summary: null,
    strengths: null,
    weakness: null,
    candidateLevel: null,
    criteriaScores,
});

describe('AiAnalysis', () => {
    it('sorts criteria by weight descending with name fallback and prioritizes label details over ai explanation', () => {
        render(
            <AiAnalysis
                aiEvaluation={buildEvaluation([
                    {
                        id: 1,
                        criteriaName: 'Culture Fit',
                        scoringCriteriaWeight: 20,
                        aiScore: 62,
                        aiExplanation: 'This explanation should stay hidden because details exist.',
                        details: [
                            { id: 14, label: 'Already fixed item', status: 'FIXED', description: 'Handled by recruiter.' },
                            { id: 11, label: 'Missing certification', status: 'MISSING', description: 'No relevant certificate was found.' },
                            { id: 13, label: 'Strong collaboration', status: 'MATCHED', description: 'The resume shows strong teamwork evidence.' },
                            { id: 12, label: 'Partial stakeholder communication', status: 'PARTIAL', description: 'Some exposure exists but it is limited.' },
                        ],
                    },
                    {
                        id: 2,
                        criteriaName: 'Technical Skills',
                        scoringCriteriaWeight: 40,
                        aiScore: 91,
                        details: [],
                    },
                    {
                        id: 3,
                        criteriaName: 'Communication',
                        scoringCriteriaWeight: 20,
                        aiScore: 70,
                        details: [],
                    },
                    {
                        id: 4,
                        criteriaName: 'Adaptability',
                        aiScore: 65,
                        details: [],
                    },
                ])}
            />
        );

        const criteriaButtons = screen.getAllByRole('button');
        expect(criteriaButtons).toHaveLength(4);
        expect(criteriaButtons[0]).toHaveTextContent('Technical Skills');
        expect(criteriaButtons[1]).toHaveTextContent('Communication');
        expect(criteriaButtons[2]).toHaveTextContent('Culture Fit');
        expect(criteriaButtons[3]).toHaveTextContent('Adaptability');

        fireEvent.click(criteriaButtons[2]);

        const detailItems = screen.getAllByRole('listitem');
        expect(detailItems.map((item) => item.textContent)).toEqual([
            'Missing certificationNo relevant certificate was found.',
            'Partial stakeholder communicationSome exposure exists but it is limited.',
            'Strong collaborationThe resume shows strong teamwork evidence.',
            'Already fixed itemHandled by recruiter.',
        ]);
        expect(screen.queryByText('This explanation should stay hidden because details exist.')).not.toBeInTheDocument();
    });

    it('falls back to ai explanation when a criteria has no details', () => {
        render(
            <AiAnalysis
                aiEvaluation={buildEvaluation([
                    {
                        id: 5,
                        criteriaName: 'Portfolio Quality',
                        scoringCriteriaWeight: 10,
                        aiScore: 58,
                        aiExplanation: 'The candidate shares enough portfolio context to justify a mid-range score.',
                        details: [],
                    },
                ])}
            />
        );

        fireEvent.click(screen.getByRole('button', { name: /Portfolio Quality/i }));
        expect(
            screen.getByText('The candidate shares enough portfolio context to justify a mid-range score.')
        ).toBeInTheDocument();
    });

    it('uses the same ordering and label template in compare detail view', () => {
        render(
            <AiAnalysis
                variant="compare"
                aiEvaluation={buildEvaluation([
                    {
                        id: 6,
                        criteriaName: 'Leadership',
                        scoringCriteriaWeight: 30,
                        aiScore: 77,
                        aiExplanation: 'Should not be shown in detail mode when labels exist.',
                        details: [
                            { id: 61, label: 'Missing leadership scope', status: 'MISSING', description: 'No team size or scope is listed.' },
                            { id: 62, label: 'Matched coaching examples', status: 'MATCHED', description: 'Mentorship examples are present.' },
                        ],
                    },
                    {
                        id: 7,
                        criteriaName: 'Execution',
                        scoringCriteriaWeight: 50,
                        aiScore: 88,
                        details: [],
                    },
                ])}
            />
        );

        fireEvent.click(screen.getByRole('button', { name: 'Detail' }));

        const compareButtons = screen.getAllByRole('button').filter(
            (button) => !['Overview', 'Detail'].includes(button.textContent)
        );
        expect(compareButtons).toHaveLength(2);
        expect(compareButtons[0]).toHaveTextContent('Execution');
        expect(compareButtons[1]).toHaveTextContent('Leadership');

        fireEvent.click(compareButtons[1]);

        const detailItems = screen.getAllByRole('listitem');
        expect(detailItems.map((item) => item.textContent)).toEqual([
            'Missing leadership scopeNo team size or scope is listed.',
            'Matched coaching examplesMentorship examples are present.',
        ]);
        expect(screen.queryByText('Should not be shown in detail mode when labels exist.')).not.toBeInTheDocument();
    });
});
