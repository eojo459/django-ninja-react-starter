import cx from 'clsx';
import { useState } from 'react';
import { Table, ScrollArea, Stack, Text } from '@mantine/core';
import classes from '../css/PricingDetailedTable.module.css';
import { IconCheck, IconX } from '@tabler/icons-react';

interface DataRow {
    name: string;
    description: string;
    freePlan?: number | boolean | string;
    basicPlan?: number | boolean | string;
    proPlan?: number | boolean | string;
    enterprisePlan?: number | boolean | string;
}

const data = [
    {
        name: 'Pricing',
        description: '',
        freePlan: '$0 /month',
        basicPlan: '$39.95 /month',
        proPlan: '$79.95 /month',
        enterprisePlan: 'Contact us',
    },
    {
        name: 'Feature',
        description: 'Feature description',
        freePlan: 'Feature for this plan',
        basicPlan: 'Feature for this plan',
        proPlan: 'Feature for this plan',
        enterprisePlan: 'Feature for this plan',
    },
    {
        name: 'Feature',
        description: 'Feature description',
        freePlan: true,
        basicPlan: true,
        proPlan: true,
        enterprisePlan: true,
    },
    {
        name: 'Email support',
        description: "",
        freePlan: true,
        basicPlan: true,
        proPlan: true,
        enterprisePlan: true,
    },
];

export function PricingDetailedTable() {
    const [scrolled, setScrolled] = useState(false);

    const rows = data.map((row: DataRow) => {
        if (typeof row.freePlan === 'boolean') {
            return (
                <Table.Tr c="#dcdcdc" key={row.name}>
                    <Table.Td maw={300}>
                        <Stack>
                            <Text size="lg">{row.name}</Text>
                            <Text size="sm">{row.description}</Text>
                        </Stack>
                    </Table.Td>
                    {row.freePlan ? <Table.Td align='center'><IconCheck/></Table.Td> : <Table.Td align='center'><IconX/></Table.Td>}
                    {row.basicPlan ? <Table.Td align='center'><IconCheck/></Table.Td> : <Table.Td align='center'><IconX/></Table.Td>}
                    {row.proPlan ? <Table.Td align='center'><IconCheck/></Table.Td> : <Table.Td align='center'><IconX/></Table.Td>}
                    {row.enterprisePlan ? <Table.Td align='center'><IconCheck/></Table.Td> : <Table.Td align='center'><IconX/></Table.Td>}
                </Table.Tr>
            );
        } 
        else if (typeof row.freePlan === 'string' || typeof row.basicPlan === 'number') {
            return (
                <Table.Tr c="#dcdcdc" key={row.name}>
                    <Table.Td maw={300}>
                        <Stack>
                            <Text size="lg">{row.name}</Text>
                            <Text size="sm">{row.description}</Text>
                        </Stack>
                    </Table.Td>
                    <Table.Td align='center'>{row.freePlan}</Table.Td> 
                    <Table.Td align='center'>{row.basicPlan}</Table.Td> 
                    <Table.Td align='center'>{row.proPlan}</Table.Td> 
                    <Table.Td align='center'>{row.enterprisePlan}</Table.Td> 
                </Table.Tr>
            );
        }
        else {
            return (<></>);
        }
    });
    

    return (
        <ScrollArea h={600} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
            <Table 
                miw={700} 
                withColumnBorders
                verticalSpacing="md"
                horizontalSpacing="md"
            >
                <Table.Thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
                    <Table.Tr>
                        <Table.Th><Text size="lg">Feature overview</Text></Table.Th>
                        <Table.Th ta="center"><Text size="lg">Free</Text></Table.Th>
                        <Table.Th ta="center"><Text size="lg">Basic</Text></Table.Th>
                        <Table.Th ta="center"><Text size="lg">Pro</Text></Table.Th>
                        <Table.Th ta="center"><Text size="lg">Enterprise</Text></Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
        </ScrollArea>
    );
}