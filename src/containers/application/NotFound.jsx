import React from 'react';
import { Row, Col } from 'react-materialize';

export default class NotFound extends React.Component {
  render() {
    return (
      <main>
        <Row>
          <Col s={12}>
            <div className='card'>
              <div className='card-content'>
                <h2 className='card-title h2-title-home center-align'> 
                  <p>Erro 404</p>
                  <p>Pagina não encontrada</p>
                </h2>
              </div>
            </div>
          </Col>
        </Row>
      </main>
    )
  }
}
