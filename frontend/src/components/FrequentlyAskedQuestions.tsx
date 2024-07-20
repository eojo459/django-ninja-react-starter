import { Image, Accordion, Grid, Container, Title, Text, Space } from '@mantine/core';
import image from '../assets/faq.svg';
import classes from '../css/FrequentlyAskedQuestions.module.scss';

export function FrequentlyAskedQuestions() {
    return (
        <div className={classes.wrapper}>
            <Container size="lg">
                <Grid id="faq-grid" gutter={50}>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Image src={image} alt="Frequently Asked Questions" />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        {/* <Title order={2} ta="left" className={classes.title}>
                            Frequently Asked Questions
                        </Title> */}

                        <Accordion chevronPosition="right" defaultValue="target-users" variant="separated">
                            <Accordion.Item className={classes.item} value="target-users">
                                <Accordion.Control className={classes.control}>Question</Accordion.Control>
                                <Accordion.Panel className={classes.panel}>
                                    <Text c="#dcdcdc" size="lg" mt="sm">Text</Text>
                                    <Space h="lg"/>
                                    <Text c="#dcdcdc" size="lg" mt="sm">Text</Text>
                                </Accordion.Panel>
                            </Accordion.Item>
                            
                            <Accordion.Item className={classes.item} value="reset-password">
                                <Accordion.Control className={classes.control}>Question</Accordion.Control>
                                <Accordion.Panel className={classes.panel}>
                                    <Text c="#dcdcdc" size="lg" mt="sm">Text</Text>
                                    <Space h="lg"/>
                                    <Text c="#dcdcdc" size="lg" mt="sm">Text</Text>
                                </Accordion.Panel>
                            </Accordion.Item>
                            {/* rovenas idea: make them answer a few questions then get recommended a plan. If they have no idea whats happening => FREE plan */}
                            <Accordion.Item className={classes.item} value="another-account">
                                <Accordion.Control className={classes.control}>Question</Accordion.Control>
                                <Accordion.Panel className={classes.panel}>
                                    <Text c="#dcdcdc" size="lg" mt="sm">Text</Text>
                                    <Space h="lg"/>
                                    <Text c="#dcdcdc" size="lg">Text</Text>
                                </Accordion.Panel>
                            </Accordion.Item>

                            <Accordion.Item className={classes.item} value="newsletter">
                                <Accordion.Control className={classes.control}>Question</Accordion.Control>
                                <Accordion.Panel className={classes.panel}>
                                    <Text c="#dcdcdc" size="lg" mt="sm">Text</Text>
                                    <Space h="lg"/>
                                    <Text c="#dcdcdc" size="lg">Text</Text>
                                </Accordion.Panel>
                            </Accordion.Item>

                            <Accordion.Item className={classes.item} value="credit-card">
                                <Accordion.Control className={classes.control}>
                                    Question
                                </Accordion.Control>
                                <Accordion.Panel className={classes.panel}>
                                    <Text c="#dcdcdc" size="lg" mt="sm">Text</Text>
                                    <Space h="lg"/>
                                    <Text c="#dcdcdc" size="lg">Text</Text>
                                </Accordion.Panel>
                            </Accordion.Item>

                            <Accordion.Item className={classes.item} value="report-format">
                                <Accordion.Control className={classes.control}>Question</Accordion.Control>
                                <Accordion.Panel className={classes.panel}>
                                    <Text c="#dcdcdc" size="lg" mt="sm">Text</Text>
                                    <Space h="lg"/>
                                    <Text c="#dcdcdc" size="lg">Text</Text>
                                </Accordion.Panel>
                            </Accordion.Item>
                        </Accordion>
                    </Grid.Col>
                </Grid>
            </Container>
        </div>
    );
}