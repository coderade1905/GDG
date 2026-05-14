import {KewtiInput} from "../kewti-inputs/component";
import {KewtiMap} from "../kewti-maps/component";
import TransactionValidator from "../kewti-banks/component";

export default function KewtiDemo() {
    return (
        <div className="h-full w-full flex items-center justify-center">
            <div className="mt-30">
                <h1>A simple page for testing components</h1>
                <KewtiInput variant="input" />
                <KewtiMap />
                <TransactionValidator />
            </div>
        </div>
    );
}