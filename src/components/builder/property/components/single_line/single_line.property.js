import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import {
	setCurrentFieldType,
	handleFieldEdit
} from '../../../../../actions/builder.action';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Switch from '@material-ui/core/Switch';
import Zoom from '@material-ui/core/Zoom';


const styles = theme => ({
  container: {
    display: 'flex',
		flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  textField: {
    // marginLeft: theme.spacing.unit,
    // marginRight: theme.spacing.unit,
  },
  dense: {
    marginTop: 16,
  },
  menu: {
    width: 200,
  },
  sizeRoot: {
    display: 'flex',
    justifyContent: "flex-start",
    margin: "10px 0px 0px",
    alignItems: 'center'
  },
  but: {
    borderRadius: 0
  },
  rangeOption: {
    width: 70
  }
});

class SingleLineProperty extends React.Component {
  state = {
    err: '',
    msg: ""
  }
  handleChange = name => event => {
    const { builder, pageNo, field, handleFieldEdit } = this.props;
    builder.page[pageNo].forEach((element) => {
      // find the field element by it uid
      if(element.uid === field.uid) {
        // check if the field is required or visible field
        //  and then update the state 
        if(name === "required" || name === 'visible' || name === 'disabled') {
          element[name] = event.target.checked;      
        } else if (name === "min" || name === 'max') {
          // we check if the value isn't greater than the max of 225
          if (event.target.value < 225) {
            element.range[name] = Math.abs(event.target.value)
            this.setState({
              err: "",
              msg: ''
            })
          } else {
            // set and error state
            this.setState({
              err: "range",
              msg: `${name.toUpperCase()} shouldn't be more than 225`
            })
          }
        } else if (name === "s" || name === 'm' || name === 'l') {
          element.size = name;
        } else{
          if (name === 'label') {
            // check if labael field isn't empty
            if (event.target.value.length === 0) {
              this.setState({
                err: "label",
                msg: "The NAME field is required and can't be empty!"
              })
            } else {
              this.setState({
                err: "",
                msg: ''
              })
            }
            element[name] = event.target.value;
          } else {
            element[name] = event.target.value;
          }
          
        }
      }
    });
    handleFieldEdit(builder.page);
	};


  render() {
    const { classes, field } = this.props;
    const { err, msg } = this.state;
    console.log('this.state', this.state);
    
    return (
      <Zoom in={true}>
        <form className={classes.container} noValidate autoComplete="off">
          <TextField
            id="outlined-name"
            label="Name"
            className={classes.textField}
            required
            error={err === 'label'}
            helperText={err === 'label' ? msg : ""}
            value={field.label}
            onChange={this.handleChange('label')}
            fullWidth
            margin="normal"
            variant="outlined"
          />

          <TextField
            id="outlined-multiline-flexible"
            label="Instruction"
            multiline
            rowsMax="4"
            fullWidth
            value={field.description}
            onChange={this.handleChange('instruction')}
            className={classes.textField}
            margin="normal"
            variant="outlined"
          />


          {/* initalValues */}
          <TextField
            id="outlined-multiline-flexible"
            label="Initial Value"
            fullWidth
            value={field.initialValue}
            onChange={this.handleChange('initialValue')}
            className={classes.textField}
            margin="normal"
            variant="outlined"
          />

          {/* size */}
          <div className={classes.sizeRoot}>
            <Typography variant="button">
              Size: &nbsp;&nbsp;
            </Typography>
            <Button
              variant={field.size === 's' ? "contained" : 'outlined'}
              size='small'
              onClick={this.handleChange('s')}
              color={field.size === 's' ? "primary" : 'default'}
              className={classes.but}
            >
              small
            </Button>
            <Button
              variant={field.size === 'm' ? "contained" : 'outlined'}
              size='small'
              onClick={this.handleChange('m')}
              color={field.size === 'm' ? "primary" : 'default'}
              className={classes.but}
            >
              medium
            </Button>
            <Button
              variant={field.size === 'l' ? "contained" : 'outlined'}
              size='small'
              onClick={this.handleChange('l')}
              color={field.size === 'l' ? "primary" : 'default'}
              className={classes.but}
            >
              large
            </Button>
          </div>


          {/* range */}
          <div className={classes.sizeRoot}>
            <Typography variant="button">
              Range: &nbsp;&nbsp;
            </Typography>
            <TextField
              id="outlined-multiline-flexible"
              label="Min"
              error={err === 'range'}
              fullWidth
              value={field.range.min}
              onChange={this.handleChange('min')}
              className={classes.rangeOption}
              margin="normal"
              variant="outlined"
            />
            <TextField
              id="outlined-multiline-flexible"
              label="Max"
              error={err === 'range'}
              fullWidth
              value={field.range.max}
              onChange={this.handleChange('max')}
              className={classes.rangeOption}
              margin="normal"
              variant="outlined"
            />
          </div>
          {
            err === 'range' &&
              <Typography variant='caption' style={{ color: 'red' }}>
                {msg}
              </Typography>
          }
          
          


          {/* required and visibility */}
          <FormControl component="fieldset">
            <FormLabel component="legend">Assign responsibility</FormLabel>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={field.required}
                    color="primary"
                    onChange={this.handleChange('required')}
                    value={field.required}
                  />
                }
                label="Required"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={field.visible}
                    color="primary"
                    onChange={this.handleChange('visible')}
                    value={field.visible}
                  />
                }
                label="Visibility"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={field.disabled}
                    color="primary"
                    onChange={this.handleChange('disabled')}
                    value={field.disabled}
                  />
                }
                label="Disable"
              />
            </FormGroup>
          </FormControl>
        </form>
      </Zoom>
    );
  }
}

function mapStateToProps(state) {
	return {
    builder: state.builder,
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({
    setCurrentFieldType: setCurrentFieldType,
    handleFieldEdit: handleFieldEdit
	}, dispatch)
}

SingleLineProperty.propTypes = {
  classes: PropTypes.object.isRequired,
  field: PropTypes.object.isRequired,
  pageNo: PropTypes.number.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SingleLineProperty));
